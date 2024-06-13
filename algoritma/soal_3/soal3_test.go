package soal3

import (
	"testing"
)

func TestSoal3(t *testing.T) {
	t.Run("test1", func(t *testing.T) {
		input1 := []string{"xc", "dz", "bbb", "dz"}
		query1 := []string{"bbb", "ac", "dz"}

		expectation := []int{1, 0, 2}
		result := soal3(input1, query1)

		for k, v := range expectation {
			if v != result[k] {
				t.Fatalf("result: %+v not match expectation: %+v\n", result, expectation)
			}
		}
	})
	t.Run("test2", func(t *testing.T) {
		input1 := []string{}
		query1 := []string{"bbb", "ac", "dz"}

		expectation := []int{0, 0, 0}
		result := soal3(input1, query1)

		for k, v := range expectation {
			if v != result[k] {
				t.Fatalf("result: %+v not match expectation: %+v\n", result, expectation)
			}
		}

	})
}
