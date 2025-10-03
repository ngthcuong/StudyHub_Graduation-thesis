// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract CertificateRegistry is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    struct Certificate {
        bytes32 certHash; // Hash duy nhất của chứng chỉ (keccak256)
        address issuer; // Địa chỉ tổ chức/cơ sở cấp chứng chỉ
        string issuerName; // Tên của tổ chức/cơ sở cấp chứng chỉ
        address student; // Địa chỉ người nhận chứng chỉ
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
     * @param _issuer địa chỉ ví bên cấp chứng chỉ
     * @param _issuerName ten bên cấp chứng chỉ
     * @param _courseName tên khóa học
     * @param _metadataURI link IPFS
     * @return certHash hash của chứng chỉ
     */
    function issueCertificate(
        address _student,
        string memory _studentName,
        address _issuer,
        string memory _issuerName,
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
            issuerName: _issuerName,
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
     * @return total tổng số chứng chỉ tìm được
     */
    function getStudentCertificatesByStudent(
        address _student
    )
        public
        view
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        bytes32[] memory hashes = studentCertificates[_student];
        total = hashes.length;

        listCertificates = new Certificate[](total);
        for (uint i = 0; i < total; i++) {
            listCertificates[i] = certificates[hashes[i]];
        }
        // return (listCertificates, total);
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo hash
     * @param _student địa chỉ ví của người học
     * @param _certHash hash của chứng chỉ
     * @return certificate chứng chỉ tìm thấy
     */
    function getStudentCertificateByHash(
        address _student,
        bytes32 _certHash
    ) public view returns (Certificate memory certificate) {
        // Kiểm tra certificate có tồn tại không
        require(
            certificates[_certHash].certHash != 0,
            "Certificate not found."
        );

        // Kiểm tra certificate có thuộc về student này không
        require(
            certificates[_certHash].student == _student,
            "Certificate does not belong to this student."
        );

        return certificates[_certHash];
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo tên khóa học
     * @param _student địa chỉ ví của người học
     * @param _keyword tên khóa học
     * @return listCertificates mảng danh sách các chứng chỉ của người học
     * @return total tổng số chứng chỉ tìm được
     */
    function getStudentCertificateByCourseName(
        address _student,
        string memory _keyword
    )
        public
        view
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        require(bytes(_keyword).length > 0, "Keyword cannot be empty");

        // Danh sách chứng chỉ của người học
        bytes32[] memory hashes = studentCertificates[_student];

        total = 0;
        for (uint i = 0; i < hashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[hashes[i]].courseName,
                    _keyword
                )
            ) {
                total++;
            }
        }

        listCertificates = new Certificate[](total);
        uint256 currentIndex = 0;
        for (uint i = 0; i < hashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[hashes[i]].courseName,
                    _keyword
                )
            ) {
                listCertificates[currentIndex++] = certificates[hashes[i]];
            }
        }

        // Trả về danh sách chứng chỉ và số lượng tìm được
        // return (listCertificates, total);
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo ngày
     * @param _student địa chỉ ví của người học
     * @param _fromDate từ ngày
     * @param _toDate đến ngày
     * @return listCertificates mảng danh sách chứa các chứng chỉ
     * @return total tổng số chứng chỉ tìm được
     */
    function getStudentCertificateByDate(
        address _student,
        uint _fromDate,
        uint _toDate
    )
        public
        view
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        bytes32[] memory hashes = studentCertificates[_student];

        total = 0;
        for (uint i = 0; i < hashes.length; i++) {
            uint issuedDate = certificates[hashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                total++;
            }
        }

        listCertificates = new Certificate[](total);
        uint256 currentIndex = 0;
        for (uint i = 0; i < hashes.length; i++) {
            uint issuedDate = certificates[hashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                listCertificates[currentIndex++] = certificates[hashes[i]];
            }
        }
        // return (listCertificates, total);
    }

    /*
    ===================================================================================
                                HÀM TÌM KIẾM CHO ADMIN  
    ===================================================================================
    */

    /**
     * @notice Hàm lấy toàn bộ chứng chỉ (cho Admin)
     * @return listCertificates mảng danh sách chứa toàn bộ chứng chỉ
     * @return total tổng số chứng chỉ tìm được
     */
    function getAllCertificates()
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        total = allCertificateHashes.length;
        listCertificates = new Certificate[](total);

        for (uint i = 0; i < total; i++) {
            listCertificates[i] = certificates[allCertificateHashes[i]];
        }
        // return (listCertificates, total);
    }

    /**
     * @notice Hàm tìm kếm chứng chỉ theo tên khóa học
     * @param _keyword tên của khóa học
     * @return listCertificates mảng danh sách các chứng chỉ
     * @return total tổng số chứng chỉ tìm được
     */
    function adminSearchByCourse(
        string memory _keyword
    )
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        require(bytes(_keyword).length > 0, "Keyword cannot be empty");

        total = 0;
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].courseName,
                    _keyword
                )
            ) {
                total++;
            }
        }

        listCertificates = new Certificate[](total);
        uint256 currentIndex = 0;
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].courseName,
                    _keyword
                )
            ) {
                listCertificates[currentIndex++] = certificates[
                    allCertificateHashes[i]
                ];
            }
        }
        // return (listCertificates, total);
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo tên người học
     * @param _keyword tên của người học
     * @return listCertificates mảng danh sách các chứng chỉ
     * @return total tổng số chứng chỉ tìm được
     */
    function adminSearchByStudentName(
        string memory _keyword
    )
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        require(bytes(_keyword).length > 0, "Keyword cannot be empty");

        total = 0;
        // Tính tổng số khóa học tìm thấy
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].studentName,
                    _keyword
                )
            ) {
                total++;
            }
        }

        listCertificates = new Certificate[](total);
        uint256 currentIndex = 0;
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            if (
                _containsIgnoreCase(
                    certificates[allCertificateHashes[i]].studentName,
                    _keyword
                )
            ) {
                listCertificates[currentIndex++] = certificates[
                    allCertificateHashes[i]
                ];
            }
        }
        // return (listCertificates, total);
    }

    /**
     * @notice Hàm tìm kiếm chứng chỉ theo ngày
     * @param _fromDate từ ngày
     * @param _toDate đến ngày
     * @return listCertificates mảng danh sách chứa các chứng chỉ
     * @return total tổng số chứng chỉ tìm được
     */
    function adminSearchByDate(
        uint _fromDate,
        uint _toDate
    )
        public
        view
        onlyRole(ADMIN_ROLE)
        returns (Certificate[] memory listCertificates, uint256 total)
    {
        total = 0;
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            uint issuedDate = certificates[allCertificateHashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                total++;
            }
        }

        listCertificates = new Certificate[](total);
        uint256 currentIndex = 0;
        for (uint i = 0; i < allCertificateHashes.length; i++) {
            uint issuedDate = certificates[allCertificateHashes[i]].issuedDate;
            if (issuedDate >= _fromDate && issuedDate <= _toDate) {
                listCertificates[currentIndex++] = certificates[
                    allCertificateHashes[i]
                ];
            }
        }
        // return (listCertificates, total);
    }
}
