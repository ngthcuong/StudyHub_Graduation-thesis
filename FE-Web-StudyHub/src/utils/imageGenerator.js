import html2canvas from "html2canvas";

export const downloadCertificateAsImage = async (certificate) => {
  const container = document.createElement("div");
  try {
    // Tạo container cho certificate
    container.style.position = "fixed";
    container.style.left = "-9999px";
    container.style.top = "0";
    container.style.zIndex = "-1";
    document.body.appendChild(container);

    // Tạo certificate element trực tiếp (không dùng backdrop)
    const certificateDiv = document.createElement("div");
    certificateDiv.style.cssText = `
      position: relative;
      margin: 0 auto;
      width: 1024px;
      background-color: #f2f2f2;
      border-radius: 6px;
      box-shadow: 0 0 0 1px #d4d4d4, 0 4px 16px -2px rgba(0, 0, 0, 0.08);
      padding: 60px 80px;
      font-family: system-ui, -apple-system, sans-serif;
    `;

    // Format date helper
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    };

    // Build certificate HTML
    certificateDiv.innerHTML = `
      <!-- Top border -->
      <div style="position: absolute; top: 4px; left: 4px; right: 4px; height: 4px; background-color: #376bd5; border-radius: 4px;"></div>
      
      <!-- Header -->
      <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 60px;">
        <div style="display: flex; align-items: flex-start; gap: 16px;">
          <div style="width: 56px; height: 56px; border-radius: 50%; background-color: #1d4ed8; color: white; display: flex; align-items: center; justify-content: center; box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1); flex-shrink: 0;">
            <svg style="width: 32px; height: 32px;" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.69 3.61.82 1.89 3.2L12 21.04l3.4 1.46 1.89-3.2 3.61-.82-.34-3.69L23 12zm-12.91 4.72l-3.8-3.81 1.48-1.48 2.32 2.33 5.85-5.87 1.48 1.48-7.33 7.35z" />
            </svg>
          </div>
          <div>
            <h2 style="font-size: 20px; font-weight: 600; letter-spacing: -0.025em; color: #1e293b; margin: 0;">${
              certificate.issuer.name
            }</h2>
            <p style="font-size: 16px; line-height: 1.4; color: #64748b; margin: 4px 0 0 0;">Certificate of Completion</p>
          </div>
        </div>
        <div style="text-align: right; font-size: 16px; line-height: 1.6; color: #64748b; min-width: 170px;">
          <p style="font-weight: 500; color: #475569; margin: 0 0 4px 0;">Certificate Code: ${
            certificate.certificateCode
          }</p>
          <p style="margin: 0;">Issue Date: ${formatDate(
            certificate.validity.issueDate
          )}</p>
        </div>
      </div>
      
      <!-- Title -->
      <div style="text-align: center; margin-bottom: 48px;">
        <h1 style="display: inline-block; font-size: 32px; font-weight: 500; letter-spacing: -0.025em; color: #1e293b; margin: 0;">Certificate of Achievement</h1>
      </div>
      
      <!-- Body -->
      <p style="text-align: center; font-size: 18px; color: #475569; margin-bottom: 20px;">This is to certify that</p>
      <h3 style="text-align: center; font-size: 40px; font-weight: 500; color: #1d4599; letter-spacing: 0.025em; margin: 0 0 20px 0;">${
        certificate.student.name
      }</h3>
      <p style="text-align: center; font-size: 18px; color: #475569; margin-bottom: 32px;">has successfully completed the</p>
      <h4 style="text-align: center; font-size: 28px; font-weight: 400; color: #1e293b; letter-spacing: -0.025em; margin: 0 0 24px 0;">${
        certificate.course.title
      }</h4>
      
      <!-- Course Details -->
      <div style="display: flex; justify-content: center; gap: 20px; width: 100%; margin-bottom: 32px;">
        <p style="text-align: center; font-size: 18px; color: #475569; margin: 0;">
          <span style="font-weight: 700;">Type:</span> ${
            certificate.course.type || "N/A"
          }
        </p>
        <p style="text-align: center; font-size: 18px; color: #475569; margin: 0;">
          <span style="font-weight: 700;">Level:</span> ${
            certificate.course.level || "N/A"
          }
        </p>
      </div>
      
      <!-- Footer -->
      <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-top: 64px; margin-bottom: 8px;">
        <div style="display: flex; flex-direction: column; align-items: center; width: 160px;">
          <div style="width: 112px; height: 112px; border-radius: 50%; background-color: #284a9f; display: flex; align-items: center; justify-content: center; color: white; font-size: 14px; font-weight: 500; letter-spacing: 0.05em; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);">LOGO</div>
          <span style="margin-top: 8px; font-size: 14px; letter-spacing: 0.025em; color: #64748b;">Official Seal</span>
        </div>
        <div style="display: flex; flex-direction: column; align-items: center; width: 240px;">
          <div style="width: 100%; height: 1px; background-color: #e2e8f0; margin-bottom: 8px;"></div>
          <span style="font-size: 16px; font-weight: 500; color: #475569; margin-bottom: 4px;">${
            certificate.issuer.name
          }</span>
          <span style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.025em; color: #64748b;">English learning system</span>
        </div>
      </div>
    `;

    container.appendChild(certificateDiv);

    // Đợi một chút để đảm bảo DOM đã render
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Chụp ảnh certificate
    const canvas = await html2canvas(certificateDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#f2f2f2",
      width: 1024,
      height: certificateDiv.scrollHeight,
      logging: false,
    });

    // Tạo link download
    const link = document.createElement("a");
    link.download = `Certificate_${
      certificate.certificateCode
    }_${new Date().getTime()}.png`;
    link.href = canvas.toDataURL("image/png");

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error("Error generating certificate image:", error);
    throw error;
  } finally {
    // Cleanup container
    document.body.removeChild(container);
  }
};
