package soal3

func soal3(input []string, query []string) []int {
	var counter = make(map[string]int)
	for _, q := range query {
		// fmt.Printf("map[%s]: %+v\n", q, counter[q])
		if c := counter[q]; c == 0 {
			counter[q] = 0
		}
		for _, i := range input {
			if q == i {
				counter[q] += 1
			}
		}
	}
	output := []int{}

	// fmt.Printf("final: %+v\n", counter)
	for _, v1 := range query {
		for k2, v2 := range counter {
			if v1 == k2 {
				output = append(output, v2)
			}
		}
	}

	return output
}
