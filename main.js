const height = 10;
const width = 10;
const bombsum = 10;
const bombpercent = bombsum / (height * width);
let safe;
let out;
/**@type Array<Array<masubase>> */
const masuwraps = [];
const start = () => {
	safe = width * height - bombsum;
	out = false;
	const main = document.getElementById("main");
	Array.from(main.childNodes).map((e) => {
		e.remove();
	});
	masuwraps.splice(0);
	document.body.classList.value=""
	let bombsumnow = 0;
	for (let i = 0; i < height + 2; i++) {
		const masuwrap = [];
		const parentelem = document.createElement("div");
		parentelem.classList = `wrap wrap_${i}`;

		for (let j = 0; j < width + 2; j++) {
			if (i === 0 || i === height + 1 || j === 0 || j === width + 1) {
				masuwrap.push(new hasi());
			} else {
				const bombnokori = bombsum - bombsumnow;
				const masunokori = width * height - ((i - 1) * width + (j - 1));
				// console.log(`bomb${bombnokori}masu${masunokori}`);
				if (
					bombnokori > 0 &&
					(masunokori <= bombnokori || Math.random() <= bombpercent)
				) {
					bombsumnow++;
					masuwrap.push(new masu(j, i, parentelem, true));
				} else {
					masuwrap.push(new masu(j, i, parentelem));
				}
			}
		}
		masuwraps.push(masuwrap);
		main.appendChild(parentelem);
	}
	console.log(masuwraps);
	masuwraps.map((v) => {
		v.map((v2) => {
			v2.checkbomb();
		});
	});
};
document.getElementById("start").addEventListener("click", start);
class masubase {
	addnum() {}
	bubbleopen() {}
	checkbomb() {}
}
class masu extends masubase {
	#x;
	#y;
	#elem;
	#hasbom;
	#num = 0;
	#isopen = false;
	hasflag = false;
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {HTMLDivElement} parentelem
	 * @property {HTMLDivElement} elem
	 */
	constructor(x, y, parentelem, hasbom = false) {
		super();
		this.#x = x;
		this.#y = y;
		this.#hasbom = hasbom;
		// console.log(`${this.#x}_${this.#y}`);
		//要素を生成
		const elem = document.createElement("div");
		elem.classList = "elem";
		elem.dataset.x = x;
		elem.dataset.y = y;
		elem.addEventListener("click", this.click);
		elem.addEventListener("contextmenu", this.rightclick);
		parentelem.appendChild(elem);
		this.#elem = elem;
		//ボムを持ってる場合周りの数字を加算
	}
	/**
	 * @param {MouseEvent} ev
	 * @this {HTMLDivElement}
	 */
	click(ev) {
		if (safe === 0 || out) return;
		const x = Number.parseInt(this.dataset.x);
		const y = Number.parseInt(this.dataset.y);
		masuwraps[y][x].bubbleopen();
	}
	/**
	 * @param {MouseEvent} ev
	 * @this {HTMLDivElement}
	 */
	rightclick(ev) {
		ev.preventDefault();
		if (safe === 0 || out) return;
		const thismasu = masuwraps[this.dataset.y][this.dataset.x];
		if (thismasu.hasflag) {
			thismasu.hasflag = false;
			this.classList.remove("flag");
		} else {
			thismasu.hasflag = true;
			this.classList.add("flag");
		}
	}
	bubbleopen() {
		this.#open();
	}
	#open() {
		if (this.hasflag) return;
		if (!this.#isopen) {
			this.#isopen = true;
			// console.log(`${this.#x}_${this.#y}open`);
			this.#elem.classList.add("open");
			if (this.#hasbom) {
				this.#elem.classList.add("bomb");
				out = true;
				document.body.classList.add("fail")
				return;
			}
			safe--;
			if (safe === 0) {
				document.body.classList.add("clear");
			}
			if (!this.#hasbom && this.#num !== 0) {
				this.#elem.innerText = this.#num;
				return;
			}
			getaround(this.#x, this.#y).map((v) => {
				v.bubbleopen();
			});
		}
	}
	addnum() {
		this.#num++;
	}
	checkbomb() {
		if (this.#hasbom) {
			getaround(this.#x, this.#y).map((v) => {
				v.addnum();
			});
		}
	}
}

class hasi extends masubase {
	constructor() {
		super();
		this;
	}
	bubbleopen() {
		return;
	}
	addnum() {
		return;
	}
}

const getaround = (x, y) => {
	const mw = (x, y) => masuwraps[y][x];
	return [
		mw(x - 1, y - 1),
		mw(x + 0, y - 1),
		mw(x + 1, y - 1),
		mw(x - 1, y + 0),
		// mw(x + 0, y + 0),
		mw(x + 1, y + 0),
		mw(x - 1, y + 1),
		mw(x + 0, y + 1),
		mw(x + 1, y + 1),
	];
};
