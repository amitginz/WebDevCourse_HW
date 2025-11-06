// 1. רשימת כל הסקינים שיש לנו בתקיית SKINS
const skins = [
    "SKINS/basic.css",
    "SKINS/dark.css",
    "SKINS/modern.css"
];

// 2. משתנה שעוקב אחרי הסקין הנוכחי
let currentSkinIndex = 0;

// 3. "תפיסה" של האלמנטים מה-HTML
const changeSkinButton = document.getElementById('change-skin-btn');
const skinLink = document.getElementById('skin-link');

// 4. הוספת "מאזין" לכפתור
changeSkinButton.addEventListener('click', function () {

    // 5. קדם את האינדקס לאבא בתור
    currentSkinIndex++;

    // 6. בדיקה אם עברנו את הסקין האחרון
    if (currentSkinIndex >= skins.length) {
        // אם כן, חזור להתחלה (אינדקס 0)
        currentSkinIndex = 0;
    }

    // 7. עדכון ה-CSS (זו השורה הקריטית)
    skinLink.href = skins[currentSkinIndex];
});