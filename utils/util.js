const text = [
	'春天来了，染绿了每个细胞，我打开窗户，沁人的花香扑面而来，我——必须出去好好欣赏一下。',
	'这是一场我和春天的约会，她从严寒中匆匆走来，我忍不住要张开双臂，迎接她的到来。一只鸟儿站在刚浸染绿色枝头悄悄地筑巢，小草带着害羞的嫩绿色探出半个小脑袋。',
	'柳树长长的枝条上，已经展开了带黄色的嫩叶，在微风中轻轻地摇曳着……',
	'院子里的樱花树，也都绽放出了花朵，白粉粉的颜色，宛如少女的脸颊。',
	'一种无法言说的美妙在心头飘绕，一种心照不宣的默契在花间闪耀。  ',
	'静静地感受那些风，还透着些许微凉，油菜花却禁不住露出笑脸，一丛丛，一簇簇，大片大片的金黄肆意蔓延。',
	'美丽的蝴蝶扇动着五彩斑斓的翅膀在花丛里翩翩起舞，为这美丽的春天增添了无限的生趣。',
	'在春天，我聆听岁月赋予的恬静；多少繁华，如过眼云烟',
	'可是，这又怎样呢？哪怕一抹嫣然的浅笑，也要抓住这短暂的约会，静赏流年。',
	'经常游走于山野，所以爱上摄影，因为总想留住眼前所看到的那些一花一木的感觉，很纯粹，也很简单。世间的美，可以是大气磅礴，也可以是如此平淡。',
	'坐长亭，一壶浊酒灌肠入，互诉衷肠尽黄昏。',
	'琴声悠悠，响彻天地之间，谱一曲天籁之音。',
	'缥缈的世界总会让人无限遐想，青山流水，碧海竹林，',
	'好一处人间仙境，置身其中身心愉悦。'
];
const url = 'https://qzonestyle.gtimg.cn/qzone/qzact/act/external/isco/img_{{index}}.JPG';
const start = new Date('2018/01/01').getTime();
const end = new Date('2018/05/30').getTime();
const imageNum = 3;
const imageCount = 21;
//以上变量都是用于生成随机数据的

//把数组转成附带路径的数据，以减少传输数据量
const pathToData = (ary) => {
	let json = {};
	let stringify = [];
	try {
		for(let obj of ary) {
			stringify.push(JSON.stringify(obj.path) + ':' + JSON.stringify(obj.value));
		}
		json = JSON.parse('{' + stringify.join(',') + '}');
	} catch(e) {}
	return json;
}

//生成随机数据
const getDemoData = (n, offset = 0) => {
	let diaries = [];
	let files = [];
	let span = (end - start) / n;
	for(let i=0; i<n; i++) {
		files = [];
		for (let j = 0; j < Math.ceil(Math.random() * imageNum); j++) {
			files.push(url.replace('{{index}}', Math.floor(Math.random() * imageCount)));
		}
		diaries.push({
			key: (i + offset).toString(),
			date: start + Math.floor(span * i),
			files: files,
			text: text[Math.floor(Math.random() * text.length)]
		});
	}
	return diaries;
}

module.exports = {
	pathToData: pathToData,
	getDemoData: getDemoData
}
