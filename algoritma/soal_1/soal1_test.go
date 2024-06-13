package soal1

import (
	"testing"
)

func TestSoal1(t *testing.T) {
	t.Run("NEGIE1", func(t *testing.T) {
		var case1 = "NEGIE1"
		var expectation = "EIGEN1"
		var result = soal1(case1)
		if result != expectation {
			t.Fatalf("result: %s not match expectation: %s\n", result, expectation)
		}
	})
	t.Run("NEGIE123", func(t *testing.T) {
		var case1 = "NEGIE123"
		var expectation = "EIGEN123"
		var result = soal1(case1)
		if result != expectation {
			t.Fatalf("result: %s not match expectation: %s\n", result, expectation)
		}
	})
	t.Run("NEGIE", func(t *testing.T) {
		var case1 = "NEGIE"
		var expectation = "EIGEN"
		var result = soal1(case1)
		if result != expectation {
			t.Fatalf("result: %s not match expectation: %s\n", result, expectation)
		}
	})
}
