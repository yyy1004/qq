const util = require('../../utils/util.js');

const app = getApp();
const systemInfo = wx.getSystemInfoSync();
const px2rpx = 750 / systemInfo.windowWidth;	//用于把 px 转为 rpx 对应的数值
const bannerHeight = 300;	//swiper 组件所在的 banner 高度值
const scrollHeight = systemInfo.windowHeight * px2rpx - bannerHeight;	//滚动列表的高度计算
const errorImage = 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/error.png';	//替换错误图片的链接
let inputIndex;	//正在编辑的回忆序号
let text = '';	//正在编辑的文字内容

Page({
	data: {
		swiperCurrent: 0,
		scrollHeight: scrollHeight,
		diaries: [{
		/*	视频数据，用于测试视频组件在手机里的表现
			"key": "8",
				"date": 1527517623858,
				"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/video.MP4"],
				"text": "记录美好的回忆",
				"video": true
			}, {
		*/
			"key": "0",
			"date": 1527342587121,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_9.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_10.JPG"],
			"text": "生活不会只有杯具，就算偶尔遇到，勇敢踩在脚下就行了，比如我这样"
		}, {
			"key": "1",
			"date": 1527341953300,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_8.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_11.JPG"],
			"text": "也许这就是他们所说的”诗和远方“吧。什么，你说少了诗？嗯...哼...”锄禾日当午，汗滴禾下土...“"
		}, {
			"key": "2",
			"date": 1527341791255,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_7.JPG"],
			"text": "最美好的，就是日出，可以静静等待沐浴光芒，内心无限期待"
		}, {
			"key": "3",
			"date": 1527341679279,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_6.JPG"],
			"text": "从体积来看，它应该是一只蜗牛爷爷，而我是一只小小Q"
		}, {
			"key": "4",
			"date": 1527341609814,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_5.JPG"],
			"text": "\"这只蓝蛙的姿势好销魂，把我的风头都抢走了！\""
		}, {
			"key": "5",
			"date": 1527341529158,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_2.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_3.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_4.JPG"],
			"text": "小小Q在路上抢镜"
		}, {
			"key": "6",
			"date": 1523509312000,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_0.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_1.JPG"],
			"text": "北回归线海水的蓝，是一层一层的，由浅入深，缓缓沁入人心"
		}, {
			"key": "7",
			"date": 1523509212000,
			"files": ["https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_12.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_13.JPG", "https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_14.JPG"],
			"text": "在春天，我聆听岁月赋予的恬静；多少繁华，如过眼云烟"
		}],
		edit: false,
		text: ''
	},

	onLoad: function () {
		//数据来源
		try {
			//this.data.diaries = wx.getStorageSync('diaries') || this.data.diaries || [];	//从缓存取数据
			//this.data.diaries = this.data.diaries || [];	//直接使用预置的数据
			this.data.diaries = util.getDemoData(10);	//生成随机数据
		} catch (e) {}
	},

	onReady: function() {
		this.setData({
			diaries: this.data.diaries
		});
	},

	//滑动切换月份时，更新swiper组件的页面数，从而变更scroll-view列表的数据
	change: function(event) {
		this.setData({
			swiperCurrent: event.detail.current
		});
	},

	//点击右下角按钮，选取图片添加回忆
	add: function () {
		let time = new Date().getTime();
		let promises = [];
		wx.chooseImage({
			success: function(res) {
				let paths = res.tempFilePaths;
				for (let i = 0, len = paths.length; i < len; i++) {
					promises.push(this.save(paths[i]));
				}
				Promise.all(promises).then(function (files) {
					this.data.diaries.unshift({
						key: this.data.diaries.length.toString(),
						date: time,
						files: files,
						text: '记录美好的回忆'
					});
					this.setData({
						diaries: this.data.diaries
					});
					try {
						wx.setStorageSync('diaries', this.data.diaries);
					} catch (e) { }
				}.bind(this));
			}.bind(this)
		});
	},

	//选取图片后，保存到开发工具缓存中，后续可以打开使用
	//这个缓存逻辑在真机上会因为缓存大小限制而不可用
	//实际业务中应该把图片上传到服务器存储
	save: function (path) {
		return new Promise(function (resolve, reject) {
			wx.saveFile({
				tempFilePath: path,
				success: function (res) {
					resolve(res.savedFilePath);
				}.bind(this),
				fail: function () {
					resolve();
				}
			});
		}.bind(this));
	},

	//触发编辑，弹出输入框
	note: function (event) {
		//获取自定义数据，确认是哪个日记需要修改，需要在wxml里绑定数据
		inputIndex = parseInt(event.currentTarget.dataset.index);
		//把对应的日记内容添加到textarea组件里
		text = this.data.diaries[inputIndex].text;
		this.setData({
			edit: true,
			value: this.data.diaries[inputIndex].text
		});
	},

	//输入文字时缓存待用
	input: function (event) {
		text = event.detail.value;
	},

	//输入框失去焦点时，保存日记内容。
	blur: function () {
		if (typeof (inputIndex) === 'undefined') {
			return;
		}
		//更新页面数据 diaries
		this.data.diaries[inputIndex].text = text;
		this.setData({
			edit: false,
			diaries: this.data.diaries
		});
		//置空并更新页面数据缓存
		inputIndex = undefined;
		try {
			wx.setStorageSync('diaries', this.data.diaries);
		} catch (e) { }
	},

	//点击非输入框区域，也触发保存
	outter: function(event) {
		if(event.target.id === 'outter') {
			this.blur();
		}
	},

	//预览图片
	preview: function (event) {
		let index = parseInt(event.currentTarget.dataset.index);
		let image = event.currentTarget.dataset.src;
		let files = this.data.diaries[index].files;
		wx.previewImage({
			current: image,
			urls: files
		});
	},

	//图片异常处理
	error: function (event) {
		let index = parseInt(event.currentTarget.dataset.index);
		let fileIndex = event.currentTarget.dataset.fileIndex;
		//使用 util.pathToData 生成附带路径的数据内容，就可以不用把整个 diaries 数组传递给视图层，减少了传递的数据量
		errorArray.push({
			path: 'diaries[' + index + '].files[' + fileIndex + ']',
			value: errorImage
		});
		this.errorHandler();
	},

	errorHandler: function () {
		clearTimeout(errorTimeout);
		errorTimeout = setTimeout(function () {
			this.setData(util.pathToData(errorArray));
			errorArray = [];
		}.bind(this), 500);
	},

	//分段渲染新数据
	scrollToLower: function () {
		let offset = this.data.diaries.length;	//追加的数据，序号从原数据的长度开始累加
		let addData = util.getDemoData(10, offset);	//随机生成追加数据，传入offset用于计算 key 的数值
		let pathData = [];	//追加数据先预处理放在这个数组里，再丢到 util.pathToData 生成附带路径的数据内容

		//todo: 这里应该与原数据合并后再进行排序，否则展示的数据就不是严格的倒序了
		//不过实际业务里，数据肯定是后端排好序再拉取下来的，所以就省略了这个步骤
		//我们把关注点放在如何为页面追加数据的处理方法上

		for (let i = 0, len = addData.length; i < len; i++) {
			pathData.push({
				path: 'diaries[' + (offset + i) + ']',
				value: addData[i]
			});
		}

		//保持逻辑层和视图层数据一致
		this.data.diaries = this.data.diaries.concat(addData);

		//把追加的数据传递给视图层
		this.setData(util.pathToData(pathData));
	}
});