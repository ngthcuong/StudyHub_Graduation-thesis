# Certificate Registry - Method IDs và ABI Reference

## Giải thích Method IDs

Trong blockchain explorers (như Etherscan), các transactions hiển thị **Method ID** thay vì tên function. Method ID là 4 bytes đầu tiên của Keccak256 hash của function signature.

### Ví dụ:

- Function: `issueCertificate(address,string,address,string,string,string,string,string)`
- Method ID: `0xd45069a9`

## Danh sách Method IDs cho Certificate Registry

### Core Functions

| Function Name          | Method ID    | Description                       |
| ---------------------- | ------------ | --------------------------------- |
| `issueCertificate`     | `0xd45069a9` | Cấp chứng chỉ mới                 |
| `getCertificateByHash` | `0x90ab95cb` | Lấy thông tin chứng chỉ theo hash |
| `getAllCertificates`   | `0x13fcfe80` | Lấy tất cả chứng chỉ (admin only) |

### Student Search Functions

| Function Name                        | Method ID    | Description                           |
| ------------------------------------ | ------------ | ------------------------------------- |
| `getStudentCertificatesByStudent`    | `0x20c7e945` | Lấy tất cả chứng chỉ của học sinh     |
| `getStudentCertificateByCourseName`  | `0x9726879c` | Tìm kiếm theo tên khóa học            |
| `getStudentCertificateByCourseType`  | `0x74c7b8e7` | Tìm kiếm theo loại khóa học           |
| `getStudentCertificateByCourseLevel` | `0x6cd93f7a` | Tìm kiếm theo độ khó                  |
| `getStudentCertificateByDate`        | `0x66914f29` | Tìm kiếm theo ngày                    |
| `getStudentCertificateByHash`        | `0x1506a24c` | Lấy chứng chỉ theo hash (cho student) |

### Admin Search Functions

| Function Name              | Method ID    | Description                       |
| -------------------------- | ------------ | --------------------------------- |
| `adminSearchByCourse`      | `0x86258d34` | Admin tìm kiếm theo tên khóa học  |
| `adminSearchByCourseType`  | `0x58f0d1ec` | Admin tìm kiếm theo loại khóa học |
| `adminSearchByCourseLevel` | `0xb24633f4` | Admin tìm kiếm theo độ khó        |
| `adminSearchByStudentName` | `0xbc7eb259` | Admin tìm kiếm theo tên học sinh  |
| `adminSearchByDate`        | `0x6e964e9c` | Admin tìm kiếm theo ngày          |

### Access Control Functions

| Function Name | Method ID    | Description             |
| ------------- | ------------ | ----------------------- |
| `grantRole`   | `0x2f2ff15d` | Cấp quyền               |
| `revokeRole`  | `0xd547741f` | Thu hồi quyền           |
| `hasRole`     | `0x91d14854` | Kiểm tra quyền          |
| `ADMIN_ROLE`  | `0x75b238fc` | Lấy ADMIN_ROLE constant |

## Cách Decode Transaction trong Explorer

1. **Tìm Method ID**: 4 bytes đầu tiên của input data
2. **Tra cứu table trên**: Tìm function tương ứng
3. **Decode parameters**: Sử dụng ABI để decode các tham số

## Certificate Structure

```solidity
struct Certificate {
    bytes32 certHash;        // Hash duy nhất của chứng chỉ
    address issuer;          // Địa chỉ tổ chức cấp chứng chỉ
    string issuerName;       // Tên tổ chức cấp chứng chỉ
    address student;         // Địa chỉ người nhận chứng chỉ
    string studentName;      // Tên người nhận chứng chỉ
    string courseName;       // Tên khóa học
    string courseType;       // Thể loại khóa học (Technology, Business, etc.)
    string courseLevel;      // Độ khó (Beginner, Intermediate, Advanced)
    uint256 issuedDate;      // Ngày cấp (timestamp)
    string metadataURI;      // URI chứa thông tin chi tiết (IPFS/URL)
}
```

## Events

| Event Name          | Signature                            | Description                     |
| ------------------- | ------------------------------------ | ------------------------------- |
| `CertificateIssued` | `CertificateIssued(bytes32,address)` | Phát sinh khi cấp chứng chỉ mới |

## Notes

- Tất cả admin functions yêu cầu `ADMIN_ROLE`
- Student functions có thể được gọi bởi bất kỳ ai
- Method IDs là deterministic và không thay đổi trừ khi function signature thay đổi
- Để decode transactions, cần sử dụng ABI file của contract
