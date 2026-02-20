import java.util.*;

class WordBreak {
    public static boolean wordBreak(String s, List<String> wordDict) {
        boolean[] dp = new boolean[s.length() + 1];
        dp[0] = true;
        Set<String> set = new HashSet<>(wordDict);

        for (int i = 1; i <= s.length(); i++) {
            for (int j = 0; j < i; j++) {
                // BUG: Incorrect substring range or flag check
                if (dp[j] && set.contains(s.substring(j + 1, i))) { // BUG: substring(j, i)
                    dp[i] = true;
                    // Missing break to optimize and ensure correctness
                }
            }
        }
        return dp[s.length()];
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextLine()) {
            String s = scanner.nextLine();
            if (scanner.hasNextInt()) {
                int n = scanner.nextInt();
                List<String> dict = new ArrayList<>();
                for (int i = 0; i < n; i++)
                    dict.add(scanner.next());
                System.out.println(wordBreak(s, dict));
            }
        }
        scanner.close();
    }
}
