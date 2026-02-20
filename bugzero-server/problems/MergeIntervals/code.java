import java.util.*;

class MergeIntervals {
    public static int[][] merge(int[][] intervals) {
        if (intervals.length == 0)
            return new int[0][0];
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        List<int[]> result = new ArrayList<>();

        int[] current = intervals[0];
        for (int i = 1; i < intervals.length; i++) {
            if (current[1] > intervals[i][0]) {
                current[1] = intervals[i][1];
            } else {
                result.add(current);
                current = intervals[i];
            }
        }
        result.add(current);
        return result.toArray(new int[result.size()][]);
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[][] intervals = new int[n][2];
            for (int i = 0; i < n; i++) {
                intervals[i][0] = scanner.nextInt();
                intervals[i][1] = scanner.nextInt();
            }
            int[][] result = merge(intervals);
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < result.length; i++) {
                sb.append("[").append(result[i][0]).append(",").append(result[i][1]).append("]");
                if (i < result.length - 1)
                    sb.append(",");
            }
            sb.append("]");
            System.out.println(sb.toString());
        }
        scanner.close();
    }
}
