package soal2

import (
	"testing"
)

func TestSoal2(t *testing.T) {
	var test1 = "Saya sangat senang mengerjakan soal algoritma"
	var test2 = "Saya sangatlah senang ngerjain soalmenyoal algoritma"
	t.Run("test1", func(t *testing.T) {
		var expectation = "mengerjakan"
		var result = soal2(test1)
		if result != expectation {
			t.Fatalf("result: %s not match with expectation: %s\n", result, expectation)
		}
	})
	t.Run("test2", func(t *testing.T) {
		var expectation = "soalmenyoal"
		var result = soal2(test2)
		if result != expectation {
			t.Fatalf("result: %s not match with expectation: %s\n", result, expectation)
		}
	})
}
