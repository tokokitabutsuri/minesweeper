const minsize = 15;
const maxsize = 120;
let safe;
let out;
/**@type Array<Array<masubase>> */
const masuwraps = [];
const start = () => {
	const tate = Number.parseInt(document.getElementById("tate").value);
	const yoko = Number.parseInt(document.getElementById("yoko").value);
	const bombsum = Number.parseInt(document.getElementById("bomb").value);
	const bombpercent = bombsum / (tate * yoko);
	const size =
		Math.min(
			(window.innerWidth - 16) / yoko,
			(window.innerHeight - document.getElementById("menu").scrollHeight - 16) /
				tate,
		) - 2;
	document.body.style.setProperty(
		"--size",
		`${Math.min(Math.max(size, minsize), maxsize)}px`,
	);

	safe = yoko * tate - bombsum;
	out = false;
	const main = document.getElementById("main");
	Array.from(main.childNodes).map((e) => {
		e.remove();
	});
	masuwraps.splice(0);
	document.body.classList.value = "";
	let bombsumnow = 0;
	for (let i = 0; i < tate + 2; i++) {
		const masuwrap = [];
		const parentelem = document.createElement("div");
		parentelem.classList = `wrap wrap_${i}`;

		for (let j = 0; j < yoko + 2; j++) {
			if ((i === 0 || i === tate + 1) && (j === 0 || j === yoko + 1)) {
				parentelem.style.display = "none";
			}
			if (i === 0 || i === tate + 1 || j === 0 || j === yoko + 1) {
				masuwrap.push(new hasi());
			} else {
				const bombnokori = bombsum - bombsumnow;
				const masunokori = yoko * tate - ((i - 1) * yoko + (j - 1));
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
	masuwraps.map((v) => {
		v.map((v2) => {
			v2.checkbomb();
		});
	});
};
document.getElementById("start").addEventListener("click", start);
class masubase {
	num() {}
	bubbleopen() {}
	checkbomb() {}
	setflag() {}
	removeflag() {}
	addnum() {}
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
		elem.addEventListener("touchstart", this.openmenu);
		elem.addEventListener("click", this.click);
		elem.addEventListener("contextmenu", this.rightclick);

		parentelem.appendChild(elem);
		this.#elem = elem;
	}
	/**
	 * @param {TouchEvent} ev
	 * @this {HTMLDivElement}
	 */
	openmenu(ev) {
		//スマホの場合のみ
		ev.preventDefault(); //Clickイベントの発生を防ぐ
		ev.stopPropagation();
		if (safe === 0 || out) return;
		const x = Number.parseInt(this.dataset.x);
		const y = Number.parseInt(this.dataset.y);
		const popup = document.getElementById("popup");
		popup.dataset.x = x;
		popup.dataset.y = y;
		const touch = ev.touches[0];
		popup.style.top = `${touch.clientY - popup.clientHeight}px`;
		popup.style.left = `${touch.clientX - popup.clientWidth / 2}px`;
		popup.style.display = "block";
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
				document.body.classList.add("fail");
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
	setflag() {
		this.hasflag = true;
		this.#elem.classList.add("flag");
	}
	removeflag() {
		this.hasflag = false;
		this.#elem.classList.remove("flag");
	}
}

class hasi extends masubase {
	constructor() {
		super();
		this;
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
document.addEventListener("DOMContentLoaded", () => {
	const observer = new MutationObserver((records) => {
		records.map((record) => {
			if (!String(record.target.classList).includes("elem")) return;
			record.target.classList.add(
				`num_${Number.parseInt(record.target.innerText)}`,
			);
		});
	});
	observer.observe(document.getElementById("main"), {
		attributes: false,
		characterData: true,
		subtree: true,
		childList: true,
	});
});

(() => {
	//メニュー関連の処理
	const popup = document.getElementById("popup");
	/**
	 * @param {MouseEvent} ev
	 * @this {HTMLDivElement}
	 */
	const open = (ev) => {
		ev.stopPropagation();
		ev.preventDefault();
		if (safe === 0 || out) return;
		const x = Number.parseInt(popup.dataset.x);
		const y = Number.parseInt(popup.dataset.y);
		console.log(`${x}_${y}`);
		masuwraps[y][x].bubbleopen();
		popup.style.display = "none";
	};
	/**
	 * @param {MouseEvent} ev
	 * @this {HTMLDivElement}
	 */
	const flag = (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		if (safe === 0 || out) return;
		const thismasu = masuwraps[popup.dataset.y][popup.dataset.x];
		if (thismasu.hasflag) {
			thismasu.removeflag();
		} else {
			thismasu.setflag();
		}
		popup.style.display = "none";
	};
	document.getElementById("popup-open").addEventListener("touchstart", open);
	document.getElementById("popup-flag").addEventListener("touchstart", flag);
	document.addEventListener("touchstart", () => {
		popup.style.display = "none";
	});
})();

//スマホなら処理を変更
