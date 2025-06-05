package com.unialert;

import com.unialert.model.Assignment;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {
    private static final Logger logger = Logger.getLogger(Main.class.getName());

    public static void main(String[] args) {
        List<Assignment> assignments = new ArrayList<>();
        Scanner sc = new Scanner(System.in);

        assignments.add(new Assignment("1", "컴퓨터공학", "자바 과제", "클래스 설계", LocalDate.of(2025, 5, 21)));
        assignments.add(new Assignment("2", "영어", "에세이 제출", "5페이지 이상", LocalDate.of(2025, 6, 5)));
        assignments.add(new Assignment("3", "수학", "중간고사 대비 문제집", "1~50번 풀기", LocalDate.of(2025, 5, 28)));

        showDueSoonAssignments(assignments);

        while (true) {
            printMenu();
            int menu = Integer.parseInt(sc.nextLine());

            if (menu == 1) addAssignment(assignments, sc);
            else if (menu == 2) printAll(assignments);
            else if (menu == 3) search(assignments, sc);
            else if (menu == 4) delete(assignments, sc);
            else if (menu == 0) {
                logger.info("프로그램 종료!");
                break;
            } else logger.info("잘못된 선택입니다.");
        }
        sc.close();
    }

    private static void printMenu() {
        logger.info("""
                ===== 과제 관리 메뉴 =====
                1. 과제 추가
                2. 전체 과제 목록 출력
                3. 과제 검색(과목명)
                4. 과제 삭제(ID)
                0. 종료
                선택: """);
    }

    private static void addAssignment(List<Assignment> assignments, Scanner sc) {
        logger.info("과제 ID: ");
        String id = sc.nextLine();

        logger.info("과목명: ");
        String courseName = sc.nextLine();

        logger.info("과제 제목: ");
        String title = sc.nextLine();

        logger.info("과제 설명: ");
        String description = sc.nextLine();

        logger.info("마감일 (예: 2025-05-21): ");
        String dueDateStr = sc.nextLine();
        LocalDate dueDate = LocalDate.parse(dueDateStr);

        assignments.add(new Assignment(id, courseName, title, description, dueDate));
        logger.info("✔️ 과제 추가 완료!");
        showDueSoonAssignments(assignments);
    }

    private static void printAll(List<Assignment> assignments) {
        logger.info("\n===== 전체 과제 목록 =====");
        for (Assignment a : assignments) {
            if (logger.isLoggable(Level.INFO)) {
                logger.info(String.format("[%s] %s | %s | %s | %s",
                        a.getId(), a.getCourseName(), a.getTitle(), a.getDescription(), a.getDueDate()));
            }
        }
    }

    private static void search(List<Assignment> assignments, Scanner sc) {
        logger.info("검색할 과목명 입력: ");
        String searchName = sc.nextLine();

        boolean found = false;
        for (Assignment a : assignments) {
            if (a.getCourseName().equalsIgnoreCase(searchName)) {
                if (logger.isLoggable(Level.INFO)) {
                    logger.info(String.format("[%s] %s | %s | %s | %s",
                            a.getId(), a.getCourseName(), a.getTitle(), a.getDescription(), a.getDueDate()));
                }
                found = true;
            }
        }
        if (!found) logger.info("검색 결과가 없습니다.");
    }

    private static void delete(List<Assignment> assignments, Scanner sc) {
        logger.info("삭제할 과제 ID 입력: ");
        String delId = sc.nextLine();

        boolean deleted = assignments.removeIf(a -> a.getId().equals(delId));
        if (deleted) logger.info("✔️ 과제가 삭제되었습니다.");
        else logger.info("해당 ID의 과제를 찾을 수 없습니다.");

        showDueSoonAssignments(assignments);
    }

    // ---- 마감임박 알림 (복잡도 최소화) ----
    private static void showDueSoonAssignments(List<Assignment> assignments) {
        LocalDate today = LocalDate.now();
        boolean alerted = false;
        logger.info("\n===== [마감임박 알림] =====");

        for (Assignment a : assignments) {
            if (isDueToday(today, a)) {
                logDueToday(a);
                alerted = true;
            } else if (isDueWithin3Days(today, a)) {
                logDueWithin3Days(a, today);
                alerted = true;
            } else if (isDueWithin7Days(today, a)) {
                logDueWithin7Days(a, today);
                alerted = true;
            }
        }
        if (!alerted) logger.info("임박한 마감 과제가 없습니다!");
    }

    private static boolean isDueToday(LocalDate today, Assignment a) {
        return ChronoUnit.DAYS.between(today, a.getDueDate()) == 0;
    }
    private static boolean isDueWithin3Days(LocalDate today, Assignment a) {
        long diff = ChronoUnit.DAYS.between(today, a.getDueDate());
        return diff > 0 && diff <= 3;
    }
    private static boolean isDueWithin7Days(LocalDate today, Assignment a) {
        long diff = ChronoUnit.DAYS.between(today, a.getDueDate());
        return diff > 3 && diff <= 7;
    }
    private static void logDueToday(Assignment a) {
        if (logger.isLoggable(Level.INFO)) {
            logger.info(String.format("[오늘 마감!] %s | %s | 마감일: %s",
                    a.getCourseName(), a.getTitle(), a.getDueDate()));
        }
    }
    private static void logDueWithin3Days(Assignment a, LocalDate today) {
        long d = ChronoUnit.DAYS.between(today, a.getDueDate());
        if (logger.isLoggable(Level.INFO)) {
            logger.info(String.format("[3일 이내 마감] %s | %s | D-%d",
                    a.getCourseName(), a.getTitle(), d));
        }
    }
    private static void logDueWithin7Days(Assignment a, LocalDate today) {
        long d = ChronoUnit.DAYS.between(today, a.getDueDate());
        if (logger.isLoggable(Level.INFO)) {
            logger.info(String.format("[일주일 이내 마감] %s | %s | D-%d",
                    a.getCourseName(), a.getTitle(), d));
        }
    }
}