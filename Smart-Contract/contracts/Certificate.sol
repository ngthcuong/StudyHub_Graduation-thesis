// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Certificate {
        bytes32 certHash; // Hash duy nhất của chứng chỉ (keccak256)
        string issuer; // Tên tổ chức/cơ sở cấp chứng chỉ
        address student; // Tên người nhận chứng chỉ
        string studentName; // Tên của người nhận chứng chỉ
        string courseName; // Tên khóa học/ môn học
        uint256 issuedDate; // Ngày cấp (timestamp)
        string metadataURI; // URI chứa thông tin chi tiết chứng chỉ (IPFS/URL)
    }

    // Danh sách tất cả hash chứng chỉ
    bytes32[] private allCertificateHashes;
    // Hash => Thông tin của chứng chỉ
    mapping(bytes32 => Certificate) private certificates;
    // Student => Danh sách hash chứng chỉ;
    mapping(address => bytes32[]) private studentCertificates;

    // Sự kiện thông báo cấp chứng chỉ
    event CertificateIssued(bytes32 certHash, address student);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    /**
     * @notice Hàm cấp chứng chỉ
     * @param _student địa chỉ ví người nhận
     * @param _studentName tên của người nhận
     * @param _issuer thông tin bên cấp chứng chỉ
     * @param _courseName tên khóa học
     * @param _metadataURI link IPFS
     * @return certHash hash của chứng chỉ
     */
    function issueCertificate(
        address _student,
        string memory _studentName,
        string memory _issuer,
        string memory _courseName,
        string memory _metadataURI
    ) public onlyRole(ADMIN_ROLE) returns (bytes32) {
        // Tạo hash của chứng chỉ
        bytes32 certHash = keccak256(
            abi.encodePacked(_student, _issuer, _courseName, block.timestamp)
        );

        // Tạo chứng chỉ mới
        Certificate memory newCert = Certificate({
            certHash: certHash,
            student: _student,
            studentName: _studentName,
            issuer: _issuer,
            courseName: _courseName,
            issuedDate: block.timestamp,
            metadataURI: _metadataURI
        });

        // Lưu vào mảng và mapping
        certificates[certHash] = newCert;
        allCertificateHashes.push(certHash);
        studentCertificates[_student].push(certHash);

        // Thông báo phát hành chứng chỉ và trả về hash của chứng chỉ
        emit CertificateIssued(certHash, _student);
        return certHash;
    }

    /**
     * @notice Hàm tìm chứng chỉ thông qua hash
     * @param _certHash hash của chứng chỉ
     * @return Certificate chứng chỉ tìm được
     */
    function getCertificateByHash(
        bytes32 _certHash
    ) public view returns (Certificate memory) {
        require(certificates[_certHash].certHash != 0, "Certificate not found");
        return certificates[_certHash];
    }

    /**
     * @notice Hàm lấy toàn bộ chứng chỉ (cho Admin)
     * @return listCertificates mảng danh sách chứa toàn bộ chứng chỉ
     */
    function getAllCertificates() public view returns (Certificate[] memory) {
        Certificate[] memory listCertificates = new Certificate[](
            allCertificateHashes.length
        );
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            listCertificates[i] = certificates[allCertificateHashes[i]];
        }
        return listCertificates;
    }

    /**
     * @dev Hàm so sánh không phân biệt hoa hay thường
     */
    function _containsIgnoreCase(
        string memory str,
        string memory keyword
    ) internal pure returns (bool) {
        bytes memory strBytes = bytes(_toLower(str));
        bytes memory keywordBytes = bytes(_toLower(keyword));

        if (keywordBytes.length == 0 || keywordBytes.length > strBytes.length) {
            return false;
        }

        for (uint i = 0; i <= strBytes.length - keywordBytes.length; i++) {
            bool matchFound = true;
            for (uint j = 0; j < keywordBytes.length; j++) {
                if (strBytes[i + j] != keywordBytes[j]) {
                    matchFound = false;
                    break;
                }
            }
            if (matchFound) return true;
        }
        return false;
    }

    /**
     *  @dev Chuyển string sang lowercase
     */
    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        for (uint i = 0; i < bStr.length; i++) {
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                bStr[i] = bytes1(uint8(bStr[i]) + 32);
            }
        }
        return string(bStr);
    }

    /*
    ===================================================================================
                                HÀM TÌM KIẾM CHO NGƯỜI HỌC      
    ===================================================================================
    */

    /**
     * @notice Hàm lấy toàn bộ chứng chỉ của người học
     * @param _student địa chỉ ví của người học
     * @return listCertificates mảng danh sách các chứng chỉ của người học
     */
    function getStudentCertificatesByStudent(
        address _student
    ) public view returns (Certificate[] memory) {
        bytes32[] memory hashes = studentCertificates[_student];
        Certificate[] memory listCertificates = new Certificate[](
            hashes.length
        );
        for (uint i = 0; i < hashes.length; i++) {
            listCertificates[i] = certificates[hashes[i]];
        }
        return listCertificates;
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo hash
     * @param _student địa chỉ ví của người học
     * @param _certHash hash của chứng chỉ
     * @return listCertificates mảng chứa các chứng chỉ
     */
    function getStudentCertificateByHash(
        address _student,
        bytes32 _certHash
    ) public view returns (Certificate[] memory) {
        bytes32[] memory hashes = studentCertificates[_student];
        Certificate[] memory temp = new Certificate[](hashes.length);
        uint count = 0;

        for (uint i = 0; i < hashes.length; i++) {
            if (certificates[hashes[i]].certHash == _certHash) {
                temp[count++] = certificates[hashes[i]];
            }
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo tên khóa học
     * @param _student địa chỉ ví của người học
     * @param _keyword tên khóa học
     */
    function getStudentCertificateByCourseName(
        address _student,
        string memory _keyword
    ) public view returns (Certificate[] memory) {
        bytes32[] memory hashes = studentCertificates[_student];
        Certificate[] memory temp = new Certificate[](hashes.length);
        uint count = 0;

        for (uint i = 0; i < hashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[hashes[i]].courseName,
                    _keyword
                )
            ) temp[count++] = certificates[hashes[i]];
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo ngày
     * @param _student địa chỉ ví của người học
     * @param _fromDate từ ngày
     * @param _toDate đến ngày
     * @return listCertificates mảng danh sách chứa các chứng chỉ
     */
    function getStudentCertificateByDate(
        address _student,
        uint _fromDate,
        uint _toDate
    ) public view returns (Certificate[] memory) {
        bytes32[] memory hashes = studentCertificates[_student];
        Certificate[] memory temp = new Certificate[](hashes.length);
        uint count = 0;

        for (uint i = 0; i < hashes.length; i++) {
            uint issuedDate = certificates[hashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                temp[count++] = certificates[hashes[i]];
            }
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }

    /*
    ===================================================================================
                                HÀM TÌM KIẾM CHO ADMIN  
    ===================================================================================
    */

    /**
     * @notice Hàm tìm kếm chứng chỉ theo tên khóa học
     * @param _keyword tên của khóa học
     * @return listCertificates mảng danh sách các chứng chỉ
     */
    function adminSearchByCourse(
        string memory _keyword
    ) public view onlyRole(ADMIN_ROLE) returns (Certificate[] memory) {
        Certificate[] memory temp = new Certificate[](
            allCertificateHashes.length
        );
        uint count = 0;

        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].courseName,
                    _keyword
                )
            ) {
                temp[count++] = certificates[allCertificateHashes[i]];
            }
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo tên người học
     * @param _keyword tên của người học
     * @return listCertificates mảng danh sách các chứng chỉ
     */
    function adminSearchByStudentName(
        string memory _keyword
    ) public view onlyRole(ADMIN_ROLE) returns (Certificate[] memory) {
        Certificate[] memory temp = new Certificate[](
            allCertificateHashes.length
        );
        uint count = 0;

        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].studentName,
                    _keyword
                )
            ) {
                temp[count++] = certificates[allCertificateHashes[i]];
            }
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo ngày
     * @param _fromDate từ ngày
     * @param _toDate đến ngày
     * @return listCertificates mảng danh sách chứa các chứng chỉ
     */
    function adminSearchByDate(
        uint _fromDate,
        uint _toDate
    ) public view onlyRole(ADMIN_ROLE) returns (Certificate[] memory) {
        Certificate[] memory temp = new Certificate[](
            allCertificateHashes.length
        );
        uint count = 0;

        for (uint i = 0; i < allCertificateHashes.length; i++) {
            uint issuedDate = certificates[allCertificateHashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                temp[count++] = certificates[allCertificateHashes[i]];
            }
        }

        Certificate[] memory listCertificates = new Certificate[](count);
        for (uint i = 0; i < count; i++) {
            listCertificates[i] = temp[i];
        }
        return listCertificates;
    }
}
