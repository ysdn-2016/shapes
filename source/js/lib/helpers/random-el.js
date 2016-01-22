
import rand from 'random-int'

export default function (arr) {
	return arr[rand(arr.length - 1)]
}