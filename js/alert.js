// js/alert.js

function deadlineNotification(assignments) {
    if (!Array.isArray(assignments)) return;
    const nowKST = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Seoul" }));
    nowKST.setHours(0,0,0,0);

    let urgentList = []; // 오늘/내일 마감만 추려서 담음

    assignments.forEach(a => {
        if (!a.examType && a.dueDate) {
            const due = new Date(a.dueDate + "T00:00:00+09:00");
            due.setHours(0,0,0,0);
            const diff = (due - nowKST) / (1000*60*60*24);

            const key = `alerted_${a.courseName}_${a.title}_${a.dueDate}_${diff}`;
            if ((diff === 1 || diff === 0) && !localStorage.getItem(key)) {
                let msg = diff === 1
                    ? `🔔 [D-1] 얼마 남지 않았어요: ${a.title} (${a.courseName})`
                    : `⚡️ [D-DAY] 오늘 마감: ${a.title} (${a.courseName})!`;
                let assignTimeLabel = a.assignTime ? " (" + a.assignTime + ")" : "";
                let body = `과목: ${a.courseName}\n마감일: ${a.dueDate}${assignTimeLabel}`;
                // 실제 알림 표시
                if (Notification.permission === "granted") {
                    new Notification(msg, {
                        body: body,
                        icon: "assets/signature_응용형1_1.png",
                        vibrate: [300, 200, 300]
                    });
                    localStorage.setItem(key, "ok");
                }
                urgentList.push(msg + " " + body);
            }
        }
    });

    // "급한 과제" 모달/팝업(추가): 여러 개 있을 때
    if (urgentList.length > 0) {
        setTimeout(() => {
            alert("급한 과제/시험!\n\n" + urgentList.join('\n\n'));
        }, 800); // 알림 뜬 뒤 약간 딜레이 두고 팝업
    }
}

function setupAlert(assignments) {
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    setInterval(()=>deadlineNotification(assignments), 60*1000); // 1분마다
    deadlineNotification(assignments);
}