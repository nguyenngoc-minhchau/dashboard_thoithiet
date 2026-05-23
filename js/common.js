// Hàm tính số ngày trong tháng (có xử lý năm nhuận)
function getDaysInMonth(month, year) {
    if (month === 'all' || !year) return 31;
    const m = parseInt(month);
    if (m === 2) {
        const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
        return isLeap ? 29 : 28;
    }
    if ([4, 6, 9, 11].includes(m)) return 30;
    return 31;
}

// Cập nhật select ngày theo tháng và năm
function updateDayOptions(yearVal, monthVal, daySelectId) {
    const daySelect = document.getElementById(daySelectId);
    if (!daySelect) return;
    
    const previousDay = daySelect.value;
    
    while (daySelect.options.length > 1) {
        daySelect.remove(1);
    }
    
    if (yearVal === 'all' || monthVal === 'all') {
        return;
    }
    
    const daysInMonth = getDaysInMonth(monthVal, parseInt(yearVal));
    
    for (let d = 1; d <= daysInMonth; d++) {
        const option = document.createElement('option');
        option.value = d;
        option.textContent = `Ngày ${d}`;
        daySelect.appendChild(option);
    }
    
    if (previousDay !== 'all' && parseInt(previousDay) <= daysInMonth) {
        daySelect.value = previousDay;
    } else {
        daySelect.value = 'all';
    }
}

// Hàm đánh giá độ mạnh tương quan theo Andy Field (2009)
function getStrengthText(r) {
    let absR = Math.abs(r);
    if (absR < 0.1) return 'rất yếu';
    if (absR < 0.3) return 'yếu';
    if (absR < 0.5) return 'trung bình';
    return 'mạnh';
}

// Hệ số tương quan Pearson
function pearsonCorr(xArr, yArr) {
    let n = xArr.length;
    if (n === 0) return 0;
    let sx = 0, sy = 0, sxy = 0, sx2 = 0, sy2 = 0;
    for (let i = 0; i < n; i++) {
        sx += xArr[i];
        sy += yArr[i];
        sxy += xArr[i] * yArr[i];
        sx2 += xArr[i] * xArr[i];
        sy2 += yArr[i] * yArr[i];
    }
    let num = n * sxy - sx * sy;
    let den = Math.sqrt((n * sx2 - sx * sx) * (n * sy2 - sy * sy));
    return den === 0 ? 0 : num / den;
}

// Hồi quy tuyến tính
function linearReg(xArr, yArr) {
    let n = xArr.length;
    if (n === 0) return { slope: 0, intercept: 0 };
    let sx = 0, sy = 0, sxy = 0, sx2 = 0;
    for (let i = 0; i < n; i++) {
        sx += xArr[i];
        sy += yArr[i];
        sxy += xArr[i] * yArr[i];
        sx2 += xArr[i] * xArr[i];
    }
    let den = n * sx2 - sx * sx;
    if (den === 0) return { slope: 0, intercept: 0 };
    let slope = (n * sxy - sx * sy) / den;
    let intercept = (sy - slope * sx) / n;
    return { slope, intercept };
}

// Parse time AM/PM to hours
function timeToHours(t) {
    if (!t) return NaN;
    let s = String(t).trim();
    let match = s.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (match) {
        let h = parseInt(match[1]), m = parseInt(match[2]), ap = match[3].toUpperCase();
        if (ap === 'PM' && h !== 12) h += 12;
        if (ap === 'AM' && h === 12) h = 0;
        return h + m / 60;
    }
    return NaN;
}

// Parse date string to object
function parseDateToYMD(dateStr) {
    if (!dateStr) return { year: null, month: null, day: null };
    let parts = String(dateStr).split('/');
    if (parts.length === 3) {
        let month = parseInt(parts[0]);
        let day = parseInt(parts[1]);
        let year = parseInt(parts[2]);
        if (!isNaN(year) && !isNaN(month) && !isNaN(day)) return { year, month, day };
    }
    return { year: null, month: null, day: null };
}