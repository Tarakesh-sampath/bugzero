import java.util.Scanner;

class RainWater {
    public static int trap(int[] height) {
        if (height == null || height.length == 0)
            return 0;
        int n = height.length;
        int[] leftMax = new int[n];
        int[] rightMax = new int[n];

        leftMax[0] = height[0];
        for (int i = 1; i < n; i++)
            leftMax[i] = Math.max(height[i], leftMax[i - 1]);

        rightMax[n - 1] = height[n - 1];
        for (int i = n - 2; i >= 0; i--)
            rightMax[i] = Math.max(height[i], rightMax[i + 1]);

        int ans = 0;
        // BUG: Off-by-one or boundary error in summing water
        for (int i = 1; i < n - 1; i++) {
            ans += Math.min(leftMax[i], rightMax[i]) + height[i]; // BUG: Should subtract height[i]
        }
        return ans;
    }

    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        if (scanner.hasNextInt()) {
            int n = scanner.nextInt();
            int[] heights = new int[n];
            for (int i = 0; i < n; i++)
                heights[i] = scanner.nextInt();
            System.out.println(trap(heights));
        }
        scanner.close();
    }
}
