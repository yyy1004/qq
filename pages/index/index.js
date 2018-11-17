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

	//预览图片
	preview: function (event) {
		let index = parseInt(event.currentTarget.dataset.index);
		let image = event.currentTarget.dataset.src;
		let files = this.data.diaries[index].files;
		wx.previewImage({
			current: image,
			urls: files
		});
	}
});