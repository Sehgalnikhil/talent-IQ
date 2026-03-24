export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    hints: [
      "A really slow way to solve this is to use a double for loop.",
      "A much more efficient way is to use a Hash Map to store the values and their indices as you iterate."
    ],
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(twoSum([2, 7, 11, 15], 9)); // Expected: [0, 1]
console.log(twoSum([3, 2, 4], 6)); // Expected: [1, 2]
console.log(twoSum([3, 3], 6)); // Expected: [0, 1]`,
      python: `def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(twoSum([2, 7, 11, 15], 9))  # Expected: [0, 1]
print(twoSum([3, 2, 4], 6))  # Expected: [1, 2]
print(twoSum([3, 3], 6))  # Expected: [0, 1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0, 1]\n[1, 2]\n[0, 1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(test1); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(test2); // Expected: ["h","a","n","n","a","H"]`,
      python: `def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(test1)  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(test2)  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: "['o', 'l', 'l', 'e', 'h']\n['h', 'a', 'n', 'n', 'a', 'H']",
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
    },
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String • Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: ["An input string is valid if: Open brackets must be closed by the same type of brackets, and Open brackets must be closed in the correct order."]
    },
    examples: [
      { input: "s = '()'", output: "true" },
      { input: "s = '()[]{}'", output: "true" },
      { input: "s = '(]'", output: "false" }
    ],
    constraints: ["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."],
    starterCode: {
      javascript: "function isValid(s) {\n  // Write your solution here\n  \n}",
      python: "def isValid(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public static boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\ntrue\nfalse", python: "True\nTrue\nFalse", java: "true\ntrue\nfalse" }
  },

  "merge-two-sorted-lists": {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: {
      text: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
      notes: ["The list should be made by splicing together the nodes of the first two lists."]
    },
    examples: [
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
    ],
    constraints: ["The number of nodes in both lists is in the range [0, 50]."],
    starterCode: {
      javascript: "function mergeTwoLists(list1, list2) {\n  // Write your solution here\n  \n}",
      python: "def mergeTwoLists(list1, list2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        // Write your solution here\n        return null;\n    }\n}"
    },
    expectedOutput: { javascript: "[1,1,2,3,4,4]", python: "[1, 1, 2, 3, 4, 4]", java: "[1, 1, 2, 3, 4, 4]" }
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      notes: []
    },
    examples: [
      { input: "nums = [1,2,3,1]", output: "true" },
      { input: "nums = [1,2,3,4]", output: "false" }
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function containsDuplicate(nums) {\n  // Write your solution here\n  \n}",
      python: "def containsDuplicate(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\nfalse", python: "True\nFalse", java: "true\nfalse" }
  },

  "single-number": {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Array • Bit Manipulation",
    description: {
      text: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one.",
      notes: ["You must implement a solution with a linear runtime complexity and use only constant extra space."]
    },
    examples: [
      { input: "nums = [2,2,1]", output: "1" },
      { input: "nums = [4,1,2,1,2]", output: "4" }
    ],
    constraints: ["1 ≤ nums.length ≤ 3 * 10⁴"],
    starterCode: {
      javascript: "function singleNumber(nums) {\n  // Write your solution here\n  \n}",
      python: "def singleNumber(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int singleNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "1\n4", python: "1\n4", java: "1\n4" }
  },

  "missing-number": {
    id: "missing-number",
    title: "Missing Number",
    difficulty: "Easy",
    category: "Array • Bit Manipulation",
    description: {
      text: "Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.",
      notes: []
    },
    examples: [
      { input: "nums = [3,0,1]", output: "2" },
      { input: "nums = [0,1]", output: "2" }
    ],
    constraints: ["n == nums.length", "1 ≤ n ≤ 10⁴"],
    starterCode: {
      javascript: "function missingNumber(nums) {\n  // Write your solution here\n  \n}",
      python: "def missingNumber(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int missingNumber(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n2", python: "2\n2", java: "2\n2" }
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Math • Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      notes: []
    },
    examples: [
      { input: "n = 2", output: "2" },
      { input: "n = 3", output: "3" }
    ],
    constraints: ["1 ≤ n ≤ 45"],
    starterCode: {
      javascript: "function climbStairs(n) {\n  // Write your solution here\n  \n}",
      python: "def climbStairs(n):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int climbStairs(int n) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n3", python: "2\n3", java: "2\n3" }
  },

  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Hash Table • String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: []
    },
    examples: [
      { input: "s = 'abcabcbb'", output: "3" },
      { input: "s = 'bbbbb'", output: "1" }
    ],
    constraints: ["0 ≤ s.length ≤ 5 * 10⁴"],
    starterCode: {
      javascript: "function lengthOfLongestSubstring(s) {\n  // Write your solution here\n  \n}",
      python: "def lengthOfLongestSubstring(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3\n1", python: "3\n1", java: "3\n1" }
  },

  "3sum": {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      notes: ["Notice that the solution set must not contain duplicate triplets."]
    },
    examples: [
      { input: "nums = [-1,0,1,2,-1,-4]", output: "[[-1,-1,2],[-1,0,1]]" }
    ],
    constraints: ["3 ≤ nums.length ≤ 3000"],
    starterCode: {
      javascript: "function threeSum(nums) {\n  // Write your solution here\n  \n}",
      python: "def threeSum(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<Integer>> threeSum(int[] nums) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[-1,-1,2],[-1,0,1]]", python: "[[-1,-1,2],[-1,0,1]]", java: "[[-1,-1,2],[-1,0,1]]" }
  },

  "group-anagrams": {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Array • Hash Table • String",
    description: {
      text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      notes: []
    },
    examples: [
      { input: "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]", output: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
    ],
    constraints: ["1 ≤ strs.length ≤ 10⁴"],
    starterCode: {
      javascript: "function groupAnagrams(strs) {\n  // Write your solution here\n  \n}",
      python: "def groupAnagrams(strs):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", python: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]", java: "[[\"bat\"],[\"nat\",\"tan\"],[\"ate\",\"eat\",\"tea\"]]" }
  },

  "product-of-array-except-self": {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array • Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      notes: ["You must write an algorithm that runs in O(n) time and without using the division operation."]
    },
    examples: [
      { input: "nums = [1,2,3,4]", output: "[24,12,8,6]" }
    ],
    constraints: ["2 ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function productExceptSelf(nums) {\n  // Write your solution here\n  \n}",
      python: "def productExceptSelf(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        // Write your solution here\n        return new int[0];\n    }\n}"
    },
    expectedOutput: { javascript: "[24,12,8,6]", python: "[24,12,8,6]", java: "[24,12,8,6]" }
  },

  "word-search": {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Array • Backtracking",
    description: {
      text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      notes: []
    },
    examples: [
      { input: "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"", output: "true" }
    ],
    constraints: ["1 ≤ m, n ≤ 6"],
    starterCode: {
      javascript: "function exist(board, word) {\n  // Write your solution here\n  \n}",
      python: "def exist(board, word):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean exist(char[][] board, String word) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true", python: "True", java: "true" }
  },

  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array • Sorting",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      notes: []
    },
    examples: [
      { input: "intervals = [[1,3],[2,6],[8,10],[15,18]]", output: "[[1,6],[8,10],[15,18]]" }
    ],
    constraints: ["1 ≤ intervals.length ≤ 10⁴"],
    starterCode: {
      javascript: "function merge(intervals) {\n  // Write your solution here\n  \n}",
      python: "def merge(intervals):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Write your solution here\n        return new int[0][0];\n    }\n}"
    },
    expectedOutput: { javascript: "[[1,6],[8,10],[15,18]]", python: "[[1,6],[8,10],[15,18]]", java: "[[1,6],[8,10],[15,18]]" }
  },

  "kth-largest-element-in-an-array": {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Array • Divide and Conquer",
    description: {
      text: "Given an integer array nums and an integer k, return the kth largest element in the array.",
      notes: ["Note that it is the kth largest element in the sorted order, not the kth distinct element."]
    },
    examples: [
      { input: "nums = [3,2,1,5,6,4], k = 2", output: "5" }
    ],
    constraints: ["1 ≤ k ≤ nums.length ≤ 10⁵"],
    starterCode: {
      javascript: "function findKthLargest(nums, k) {\n  // Write your solution here\n  \n}",
      python: "def findKthLargest(nums, k):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "5", python: "5", java: "5" }
  },

  "coin-change": {
    id: "coin-change",
    title: "Coin Change",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.",
      notes: ["Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1."]
    },
    examples: [
      { input: "coins = [1,2,5], amount = 11", output: "3" }
    ],
    constraints: ["1 ≤ coins.length ≤ 12", "0 ≤ amount ≤ 10⁴"],
    starterCode: {
      javascript: "function coinChange(coins, amount) {\n  // Write your solution here\n  \n}",
      python: "def coinChange(coins, amount):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int coinChange(int[] coins, int amount) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3", python: "3", java: "3" }
  },

  "median-of-two-sorted-arrays": {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array • Binary Search",
    description: {
      text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      notes: ["The overall run time complexity should be O(log (m+n))."]
    },
    examples: [
      { input: "nums1 = [1,3], nums2 = [2]", output: "2.00000" }
    ],
    constraints: ["0 ≤ m, n ≤ 1000"],
    starterCode: {
      javascript: "function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n  \n}",
      python: "def findMedianSortedArrays(nums1, nums2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        // Write your solution here\n        return 0.0;\n    }\n}"
    },
    expectedOutput: { javascript: "2.00000", python: "2.00000", java: "2.00000" }
  },

  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array • Two Pointers",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      notes: []
    },
    examples: [
      { input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]", output: "6" }
    ],
    constraints: ["1 ≤ height.length ≤ 2 * 10⁴"],
    starterCode: {
      javascript: "function trap(height) {\n  // Write your solution here\n  \n}",
      python: "def trap(height):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int trap(int[] height) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "6", python: "6", java: "6" }
  },

  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List • Divide and Conquer",
    description: {
      text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      notes: []
    },
    examples: [
      { input: "lists = [[1,4,5],[1,3,4],[2,6]]", output: "[1,1,2,3,4,4,5,6]" }
    ],
    constraints: ["0 ≤ lists.length ≤ 10⁴"],
    starterCode: {
      javascript: "function mergeKLists(lists) {\n  // Write your solution here\n  \n}",
      python: "def mergeKLists(lists):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        // Write your solution here\n        return null;\n    }\n}"
    },
    expectedOutput: { javascript: "[1,1,2,3,4,4,5,6]", python: "[1,1,2,3,4,4,5,6]", java: "[1,1,2,3,4,4,5,6]" }
  },

  "regular-expression-matching": {
    id: "regular-expression-matching",
    title: "Regular Expression Matching",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where: '.' Matches any single character. '*' Matches zero or more of the preceding element.",
      notes: []
    },
    examples: [
      { input: "s = 'aa', p = 'a'", output: "false" },
      { input: "s = 'aa', p = 'a*'", output: "true" }
    ],
    constraints: ["1 ≤ s.length, p.length ≤ 20"],
    starterCode: {
      javascript: "function isMatch(s, p) {\n  // Write your solution here\n  \n}",
      python: "def isMatch(s, p):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean isMatch(String s, String p) {\n        // Write your solution here\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "false\ntrue", python: "False\nTrue", java: "false\ntrue" }
  },

  "longest-valid-parentheses": {
    id: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
      notes: []
    },
    examples: [
      { input: "s = '(()'", output: "2" },
      { input: "s = ')()())'", output: "4" }
    ],
    constraints: ["0 ≤ s.length ≤ 3 * 10⁴"],
    starterCode: {
      javascript: "function longestValidParentheses(s) {\n  // Write your solution here\n  \n}",
      python: "def longestValidParentheses(s):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int longestValidParentheses(String s) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "2\n4", python: "2\n4", java: "2\n4" }
  },

  "edit-distance": {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
      notes: ["You have the following three operations permitted on a word: Insert a character, Delete a character, Replace a character."]
    },
    examples: [
      { input: "word1 = 'horse', word2 = 'ros'", output: "3" }
    ],
    constraints: ["0 ≤ word1.length, word2.length ≤ 500"],
    starterCode: {
      javascript: "function minDistance(word1, word2) {\n  // Write your solution here\n  \n}",
      python: "def minDistance(word1, word2):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int minDistance(String word1, String word2) {\n        // Write your solution here\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "3", python: "3", java: "3" }
  }
,
"number-of-islands": {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Array • Depth-First Search • Breadth-First Search • Graph",
    description: {
      text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
      notes: ["An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water."]
    },
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1"
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3"
      }
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300", "grid[i][j] is '0' or '1'"],
    starterCode: {
      javascript: "function numIslands(grid) {\n  // Write your solution here\n}",
      python: "def numIslands(grid):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}"
    },
    expectedOutput: { javascript: "1\n3", python: "1\n3", java: "1\n3" }
  },
  "invert-binary-tree": {
    id: "invert-binary-tree",
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Tree • Depth-First Search • Breadth-First Search • Binary Tree",
    description: {
      text: "Given the root of a binary tree, invert the tree, and return its root.",
      notes: []
    },
    examples: [
      { input: "root = [4,2,7,1,3,6,9]", output: "[4,7,2,9,6,3,1]" }
    ],
    constraints: ["The number of nodes in the tree is in the range [0, 100].", "-100 ≤ Node.val ≤ 100"],
    starterCode: {
      javascript: "function invertTree(root) {\n  // Write your solution here\n}",
      python: "def invertTree(root):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        return null;\n    }\n}"
    },
    expectedOutput: { javascript: "[4,7,2,9,6,3,1]", python: "[4,7,2,9,6,3,1]", java: "[4,7,2,9,6,3,1]" }
  },
  "implement-trie-prefix-tree": {
    id: "implement-trie-prefix-tree",
    title: "Implement Trie (Prefix Tree)",
    difficulty: "Medium",
    category: "Hash Table • String • Design • Trie",
    description: {
      text: "A trie (pronounced as 'try') or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. There are various applications of this data structure, such as autocomplete and spellchecker.",
      notes: ["Implement the Trie class."]
    },
    examples: [
      { input: '["Trie", "insert", "search", "search", "startsWith", "insert", "search"]\n[[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]', output: "[null, null, true, false, true, null, true]" }
    ],
    constraints: ["1 ≤ word.length, prefix.length ≤ 2000", "word and prefix consist only of lowercase English letters."],
    starterCode: {
      javascript: "class Trie {\n  constructor() {}\n  insert(word) {}\n  search(word) {}\n  startsWith(prefix) {}\n}",
      python: "class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word: str) -> None:\n        pass\n    def search(self, word: str) -> bool:\n        pass",
      java: "class Trie {\n    public Trie() {}\n    public void insert(String word) {}\n    public boolean search(String word) {}\n}"
    },
    expectedOutput: { javascript: "true", python: "True", java: "true" }
  },
  "subsets": {
    id: "subsets",
    title: "Subsets",
    difficulty: "Medium",
    category: "Array • Backtracking • Bit Manipulation",
    description: {
      text: "Given an integer array nums of unique elements, return all possible subsets (the power set).",
      notes: ["The solution set must not contain duplicate subsets. Return the solution in any order."]
    },
    examples: [
      { input: "nums = [1,2,3]", output: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
    ],
    constraints: ["1 ≤ nums.length ≤ 10", "-10 ≤ nums[i] ≤ 10", "All the numbers of nums are unique."],
    starterCode: {
      javascript: "function subsets(nums) {\n  // Write your solution here\n}",
      python: "def subsets(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<Integer>> subsets(int[] nums) {\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", python: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]", java: "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]" }
  },
  "permutations": {
    id: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    category: "Array • Backtracking",
    description: {
      text: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
      notes: []
    },
    examples: [
      { input: "nums = [1,2,3]", output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }
    ],
    constraints: ["1 ≤ nums.length ≤ 6", "-10 ≤ nums[i] ≤ 10", "All the characters of nums are unique."],
    starterCode: {
      javascript: "function permute(nums) {\n  // Write your solution here\n}",
      python: "def permute(nums):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public List<List<Integer>> permute(int[] nums) {\n        return new ArrayList<>();\n    }\n}"
    },
    expectedOutput: { javascript: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", python: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]", java: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]" }
  },
  "course-schedule": {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Depth-First Search • Breadth-First Search • Graph • Topological Sort",
    description: {
      text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.",
      notes: ["Return true if you can finish all courses. Otherwise, return false."]
    },
    examples: [
      { input: "numCourses = 2, prerequisites = [[1,0]]", output: "true" },
      { input: "numCourses = 2, prerequisites = [[1,0],[0,1]]", output: "false" }
    ],
    constraints: ["1 ≤ numCourses ≤ 2000", "0 ≤ prerequisites.length ≤ 5000"],
    starterCode: {
      javascript: "function canFinish(numCourses, prerequisites) {\n  // Write your solution here\n}",
      python: "def canFinish(numCourses, prerequisites):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\nfalse", python: "True\nFalse", java: "true\nfalse" }
  },
  "word-break": {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Hash Table • String • Dynamic Programming • Trie • Memoization",
    description: {
      text: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
      notes: ["Note that the same word in the dictionary may be reused multiple times in the segmentation."]
    },
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: "true" }
    ],
    constraints: ["1 ≤ s.length ≤ 300", "1 ≤ wordDict.length ≤ 1000"],
    starterCode: {
      javascript: "function wordBreak(s, wordDict) {\n  // Write your solution here\n}",
      python: "def wordBreak(s: str, wordDict: list) -> bool:\n    pass",
      java: "class Solution {\n    public boolean wordBreak(String s, List<String> wordDict) {\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true", python: "True", java: "true" }
  },
  "validate-binary-search-tree": {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Tree • Depth-First Search • Binary Search Tree • Binary Tree",
    description: {
      text: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      notes: ["A valid BST is defined as follows: The left subtree of a node contains only nodes with keys less than the node's key. The right subtree of a node contains only nodes with keys greater than the node's key. Both the left and right subtrees must also be binary search trees."]
    },
    examples: [
      { input: "root = [2,1,3]", output: "true" },
      { input: "root = [5,1,4,null,null,3,6]", output: "false" }
    ],
    constraints: ["The number of nodes in the tree is in the range [1, 10⁴].", "-2³¹ ≤ Node.val ≤ 2³¹ - 1"],
    starterCode: {
      javascript: "function isValidBST(root) {\n  // Write your solution here\n}",
      python: "def isValidBST(root):\n    # Write your solution here\n    pass",
      java: "class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return false;\n    }\n}"
    },
    expectedOutput: { javascript: "true\nfalse", python: "True\nFalse", java: "true\nfalse" }
  }
};

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
  cpp: {
    name: "C++",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
    monacoLang: "cpp",
  },
};
