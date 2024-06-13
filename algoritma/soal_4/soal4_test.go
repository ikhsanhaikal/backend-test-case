package soal4

import (
	"testing"
)

func TestSoal4(t *testing.T) {
	t.Run("test 1", func(t *testing.T) {
		test1 := [][]int{
			{2, 0, 8},
			{3, 6, 0},
			{2, 3, 2},
		}
		expectation := -6
		result := soal4(test1)

		if result != expectation {
			t.Fatalf("expectation: %d, result: %d\n", expectation, result)
		}
	})
	t.Run("test 2", func(t *testing.T) {
		test1 := [][]int{
			{1, 2, 0},
			{4, 5, 6},
			{7, 8, 9},
		}
		expectation := 3
		result := soal4(test1)

		if result != expectation {
			t.Fatalf("expectation: %d, result: %d\n", expectation, result)
		}
	})
	t.Run("test 3", func(t *testing.T) {
		test1 := [][]int{
			{1, 2},
			{0, 5},
		}
		expectation := 4
		result := soal4(test1)

		if result != expectation {
			t.Fatalf("expectation: %d, result: %d\n", expectation, result)
		}
	})
}
