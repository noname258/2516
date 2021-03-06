javascript:
(function()
{
var ex_list=[], ma_list=[], re_list=[], clist=[];	//データ取得用変数
var play_hist=[], play_hist50=[], play_hist30=[];
	
var your_id="", your_rating="", your_max_rating="";
var rankicon="", rankname="";
var your_icon="", your_plate="", your_frame="";
var datalist=[], ranklist=[], complist=[];

var best_ave=0, best_limit=0, hist_limit=0;
var expect_max=0, best_rating=0, top_rate=0, recent_rating=0, hist_rating=0, best_left=0, hist_left=0;
var old_rule_rating=0, old_rule_max=0, your_recent=0, your_recent_ave=0, your_r_waku=0, your_recent_ave30=0, your_r_waku30=0;
var rcnt50=0, rcnt30=0;

var frd_id="", frd_rating="", frd_max_rating="";
var frd_datalist=[], frd_rankicon="", frd_rankname="";
var frd_best_ave=0, frd_best_limit=0, frd_hist_limit=0;
var frd_expect_max=0, frd_best_rating=0, frd_top_rate=0, frd_recent_rating=0, frd_hist_rating=0, frd_best_left=0, frd_hist_left=0;
var frd_old_rule_rating=0, frd_old_rule_max=0, frd_recent=0;
var friend_id_code="";

var clist=[], ranklist=[], complist=[];	// コレクション系
var tweet_rate_str="", 	tweet_best_str=""; // ツイート系
var friendmode = false; // 動作モード系

var hashtag = "%e8%88%9e%e3%83%ac%e3%83%bc%e3%83%88%e8%a7%a3%e6%9e%90";	// 舞レート解析
var mainet_dom = 'https://maimai-net.com/maimai-mobile/';
var mra_update_algorithm = "2018.05.13";
var max_play_hist=50;

var music_count=maimai_inner_lv.length;
var music_update=mra_update_mlist;
var modoki_update=(mra_update_algorithm >= mra_update_llist)?mra_update_algorithm:mra_update_llist;
	
var c_rank_trophy_list =
    [["元皆伝(旧)", "元十段(旧)", "元九段(旧)", "元八段(旧)", "元七段(旧)", "元六段(旧)",
      "元五段(旧)", "元四段(旧)", "元三段(旧)", "元二段(旧)", "元初段(旧)"]];
var c_rank_plate_list =[
	["青皆伝", "青十段", "青九段", "青八段"], 
	["緑皆伝(旧)", "緑十段(旧)", "緑九段(旧)", "緑八段(旧)", "緑七段(旧)", "緑六段(旧)", 
	 "緑五段(旧)", "緑四段(旧)", "緑三段(旧)", "緑二段(旧)", "緑初段(旧)"],
	["緑皆伝", "緑十段", "緑九段", "緑八段"],
	["橙皆伝(旧)", "橙十段(旧)", "橙九段(旧)", "橙八段(旧)", "橙七段(旧)", "橙六段(旧)", 
	 "橙五段(旧)", "橙四段(旧)", "橙三段(旧)", "橙二段(旧)", "橙初段(旧)"],
	["橙皆伝", "橙十段", "橙九段", "橙八段"], ["桃皆伝", "桃十段", "桃九段", "桃八段"],
	["紫皆伝", "紫十段", "紫九段", "紫八段"]
];

var c_comp_trophy_list = [["舞舞", "神", "極", "覇者"]];
var c_comp_plate_list=[
	["真舞舞", "真神", "真将", "真極"],
	["超舞舞", "超神", "超将", "超極"], ["檄舞舞", "檄神", "檄将", "檄極"],
	["橙舞舞", "橙神", "橙将", "橙極"], ["暁舞舞", "暁神", "暁将", "暁極"],
	["桃舞舞", "桃神", "桃将", "桃極"], ["櫻舞舞", "櫻神", "櫻将", "櫻極"],
	["紫舞舞", "紫神", "紫将", "紫極"], ["菫舞舞", "菫神", "菫将", "菫極"]
];

/* data.htmlを使う前提 */
function get_your_id(addr)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			var tmp=$(data).find('.underline');
			if(tmp.length==0)
			{
				alert('maimai.netの利用権がない模様。\n1クレ以上プレーしてから再トライしてください。');
				window.location.href=mainet_dom + "home";
			}
			your_id = tmp[0].innerText.trim();
			var ratingstr = $(data).find('.blue')[1].innerText.trim();
			your_rating = ratingstr.replace(/（.*/, "");
			your_max_rating = ratingstr.replace(/.*（MAX /, "").replace(/）/, "");
			var ri=$($(data).find('.f_r')).find('img');
			your_icon=$(data).find('img.icon_you.f_l')[0].getAttribute('src');
			rankicon=(ri.length!=0)?(ri[0].getAttribute('src')):("");
		}
	);
	return;
}

function get_friend_name()
{
	/* 今見ているフレンドページから取得 */
	frd_id = $.find('span.name0')[0].innerText;
	var ratingstr=$.find('span.blue')[1].innerText.trim();
	frd_rating=ratingstr.replace(/（.*/, "");
	frd_max_rating=ratingstr.replace(/.*（MAX /, "").replace(/）/, "");
	var ri=$($.find('div.f_r')).find('img');
	frd_rankicon=(ri.length!=0)?(ri[0].getAttribute('src')):("");

	
	$.ajax({type:'GET', url:mainet_dom+"friend/friendVs/", async: false})
		.done(function(data)
		{
			var tmp=Array.prototype.slice.call($($(data).find('select.vs_select')[2]).find('option'))
			var idx=tmp.map(function(n){return n.innerText;}).indexOf(frd_id);
			if(idx==-1)
			{
				alert('お気に入り登録されていない模様。\nお気に入り登録してあげてください。');
				window.location.href=mainet_dom+"friend/friendProfile"
			}
			else
				friend_id_code=tmp[idx].getAttribute('value')
		}
	);
	return;
}

function get_music_mdata_name(md)
{
	var tmp =$(md).find('div');
	if(tmp.length==0)
		return md.innerText.trim();
	else
		return tmp[0].innerText.trim();
}

function get_music_mdata(achive_list, addr)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			var m=$(data).find("#accordion");
			var mlist=Array.prototype.slice.call($(m).find('h3'))
				.map(get_music_mdata_name)
			var slist=Array.prototype.slice.call($(m).find('.list'))
				.map(function(x){return $(x).find('td')[3].innerText.replace(/,/g, '');});
			var m_length=mlist.length;
			for(var i=0; i<m_length; i++)
				achive_list.push([mlist[i], slist[i]]);
		}
	);
	return;
}
	
function get_music_frd_mdata_sub(x)
{
	var l=$(x).find('td');
	return [l[0].innerText.trim(), l[1].innerText.replace(/,/g, ""), l[3].innerText.replace(/,/g, "")];
}		
	
function get_music_frd_mdata(achive_list, addr)
{
	$.ajax({type:'POST', url:addr, data:"genre=99&friend="+ friend_id_code, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			var m =Array.prototype.slice.call($($(data).find('#accordion')).find('h3'))
			m.map(function(x){achive_list.push(get_music_frd_mdata_sub(x));});
		}
	);
	return;
}
	
function get_trophy_data(collection_list, addr, dlist)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			var list_bom=$(data).find('.on');
			var np_list=Array.prototype.slice.call(list_bom).map(function(x){return x.innerText.trim();});
			var lnum = dlist.map(function(x){return np_list.indexOf(x);});
			lnum.push(-1);
			lnum=Array.from(new Set(lnum)).sort(function(a,b){return a-b;});
			lnum.shift();	// lnumの先頭(-1になるはず)を削除
			lnum.map(function(n){collection_list.push({name:list_bom[n].innerText.trim(), addr:""});});
		}
	);
	return;
}

function get_nameplate_data(collection_list, addr, dlist)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			your_plate=$($(data).find('div.text_c')[2]).find('img')[0].getAttribute('src');
			var list_bom=$(data).find('.on');
			var np_list=Array.prototype.slice.call(list_bom).map(function(x){return x.innerText.trim();});
			var lnum = dlist.map(function(x){return np_list.indexOf(x);});
			lnum.push(-1);
			lnum=Array.from(new Set(lnum)).sort(function(a,b){return a-b;});
			lnum.shift();	// lnumの先頭(-1になるはず)を削除
			lnum.map(function(n){collection_list.push({name:list_bom[n].innerText.trim(),
						addr:$(list_bom[n]).find('img')[0].getAttribute('src')});});
		}
	);
	return;
}

function get_current_frame(addr)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			your_frame=$($(data).find('div.text_c')[2]).find('img')[0].getAttribute('src');
		}
	);
	return;
}

function true_achive(score, score100per)
{
	var true_100per=score100per - (score100per%500)
	if(score == "---" || score100per == 0)
		return 0;
	else
		return Number(score)/(score100per - (score100per%500));
}
	
function sort_condition(a,b)
{
	var lv_a, lv_b, achi_a, achi_b;
	if(b.music_rate != a.music_rate)
	{
		return b.music_rate - a.music_rate;
	}
	lv_a=a.lv.map(mra_diff2tmp).sort(function(a,b){return b-a;});
	lv_b=b.lv.map(mra_diff2tmp).sort(function(a,b){return b-a;});
	for(var i=0; i<3; i++)
	{
		if(lv_a[i] != lv_b[i])
			return lv_b[i] - lv_a[i];
	}
	achi_a=Math.max.apply(null, a.achive);
	achi_b=Math.max.apply(null, b.achive);
	return achi_b - achi_a;
}
	
function true_level(lvlist, scorelist)
{
	var levellist=[], tmplv=0;
	for(var n=0; n<3; n++)
	{
		tmplv=mra_diff2tmp(lvlist[n]);
		(Math.floor(tmplv)<12||scorelist[n]%500==0)?(levellist.push(lvlist[n])):
		(levellist.push(Math.floor(tmplv) + "." + [20,60,30,21,17,35,50,28,55,65].indexOf((scorelist[n]/5)%100-2*Math.floor(tmplv))));
	}
	
	return levellist;
}

function get_playdata_sub(li)
{
	if(play_hist.length >= max_play_hist)	//過去30譜面まで
		return;
	if($(li).find('hr').length == 0)	// resultではないところ
		return;

	var name=$(li).find('.playdata_music_title')[0].innerText;
	var diff=($(li).find('.playlog_remaster').length!=0)?2:
		($(li).find('.playlog_master').length!=0)?1:
		($(li).find('.playlog_expert').length!=0)?0:-1;
	var achi=$(li).find('.result_icon_block3.text_c.f_l')[0].innerText.trim()
		.replace(/\n/g, "").replace(/.*：/, "").replace(/％/, "");
	achi=Number((Number(achi)/100).toFixed(4));
	
	var rate_value=0;
	var m_idx=maimai_inner_lv.map(function(x){return x.name;}).indexOf(name);
	var nick="";
	
	if(diff<0 || m_idx<0)
		rate_value=0;
	else
	{
		var lvlist=true_level(maimai_inner_lv[m_idx].levels, maimai_inner_lv[m_idx].score);
		rate_value=mra_arch2rate_100(achi, lvlist[diff]);
		nick=maimai_inner_lv[m_idx].nick;
	}
	play_hist.push({idx:play_hist.length, name:(nick!="")?nick:name, diff:diff, achi:achi, rate_value:rate_value});
	return;
}

function get_playdata(addr)
{
	$.ajax({type:'GET', url:addr, async: false})
		.done(function(data)
		{
			//成功時の処理本体
			var play_hist_raw = Array.prototype.slice.call($($(data).find('#accordion')[0]).find('li'));
			play_hist_raw.map(get_playdata_sub);	//play_histに必要データ格納
			play_hist_raw=null;
		}
	);
	return;
}

function data2rating(dlist, f) /* 1:自分, 2:フレンド */
{
	var mlist_length=ma_list.length, re_length=re_list.length, re_count=0, lvlist_count=0;

	for(var i=0; i<mlist_length; i++)
	{
		//lv表と取得データの名前が一致なら処理を進める
		if(ma_list[i][0] == maimai_inner_lv[lvlist_count].name)
		{
			dlist.push({
				name:ma_list[i][0],
				nick:maimai_inner_lv[lvlist_count].nick,
				achive:[true_achive(ex_list[i][f], maimai_inner_lv[lvlist_count].score[0]),
				true_achive(ma_list[i][f], maimai_inner_lv[lvlist_count].score[1]),
				(re_count >= re_length)?"---":
					(re_list[re_count][0]==ma_list[i][0])?
						true_achive(re_list[re_count++][f], maimai_inner_lv[lvlist_count].score[2]):"---"],
				lv:true_level(maimai_inner_lv[lvlist_count].levels, maimai_inner_lv[lvlist_count].score),
				rate_values:[0,	0, 0],
				shortage:["", "", ""],
				music_rate : 0
			});
			dlist[i].rate_values[0] = mra_arch2rate_100(dlist[i].achive[0], dlist[i].lv[0]);
			dlist[i].rate_values[1] = mra_arch2rate_100(dlist[i].achive[1], dlist[i].lv[1]);
			dlist[i].rate_values[2] = mra_arch2rate_100(dlist[i].achive[2], dlist[i].lv[2]);
			dlist[i].music_rate = Math.max.apply(null, dlist[i].rate_values);
			
			lvlist_count++;
		}
		else	// 違う場合は空データを入れて終了。
		{
			dlist.push(
				{name:ma_list[i][0],
				 nick:"",
				achive:[0,0,(re_count >= re_length)?"---":
							(re_list[re_count][0]==ma_list[i][0])?0:"---"],
				lv:["","",""],
				rate_values:[0,	0, 0],
				shortage:["", "", ""],
				music_rate : 0
			});
		}
	}
	dlist.sort(sort_condition);

	if(hashtag.slice(-4)=="test")
	{
		best_limit = dlist[29].music_rate;
		for(var i=30; i<mlist_length; i++)
		{
			for(var x=0; x<3; x++)
			{
				dlist[i].shortage[x] =
					mra_shortage_achive(best_limit, dlist[i].lv[x], dlist[i].achive[x])
			}
		}
	}
	return dlist[0].music_rate;
}
	
function current_rank()
{
	var colorlist=["", "", "", "", "", "", "", "", "", "金", "黒", "赤"];
	var ranklist=["", "初段", "二段", "三段", "四段", "五段", "六段", "七段", "八段", "九段", "十段", "皆伝"];

	if(rankicon!="")
	{
		rankname = colorlist[Number(rankicon.slice(-6, -4))];
		rankname += ranklist[Number(rankicon.slice(-9, -7))];
	}
	if(frd_rankicon!="")
	{
		frd_rankname = colorlist[Number(frd_rankicon.slice(-6, -4))];
		frd_rankname += ranklist[Number(frd_rankicon.slice(-9, -7))];
	}
	colorlist=null;
	ranklist=null;
	return;
}
	
function collection_filter(collection_list)
{
	var c_length = collection_list.length;
	var cf_length;
	var check=false;
	var lnum, tmpidx,tmplist=[];

	// 初代のrank称号
	cf_length=c_rank_trophy_list.length;
	for(var i=0; i<cf_length; i++)
	{
		lnum = c_rank_trophy_list[i].map(function(x){return collection_list.map(function(y){return y.name;}).indexOf(x);});
		tmpidx=-1;
		while(tmpidx==-1 && lnum.length!=0)
			tmpidx=lnum.shift();
		ranklist.push((tmpidx!=-1)?collection_list[tmpidx].name:"");
	}
	
	// nameplateなrank
	cf_length=c_rank_plate_list.length;
	for(var i=0; i<cf_length; i++)
	{
		lnum = c_rank_plate_list[i].map(function(x){return collection_list.map(function(y){return y.name;}).indexOf(x);});
		tmpidx=-1;
		while(tmpidx==-1 && lnum.length!=0)
			tmpidx=lnum.shift();
		ranklist.push((tmpidx!=-1)?"<img src='"+ collection_list[tmpidx].addr + "' width=105>":"");
	}

	// 初代のcomp称号
	cf_length=c_comp_trophy_list.length;
	for(var i=0; i<cf_length; i++)
	{	tmplist=[];
		lnum = c_comp_trophy_list[i].map(function(x){return collection_list.map(function(y){return y.name;}).indexOf(x);});
		if(lnum[0]!=-1 || lnum[1]!=-1) {lnum[2]=-1; lnum[3]=-1;} // 舞舞or神なら極, 覇者は表示しない
		if(lnum[2]!=-1) lnum[3]=-1; // 極なら覇者は表示しない
		while(lnum.length>0)
		{
			tmpidx=lnum.shift();	// tmpにlnumの先頭
			if(tmpidx!=-1) tmplist.push(collection_list[tmpidx].name);
		}
		complist.push(tmplist.join(' '));
	}

	// nameplateなcomplete
	cf_length=c_comp_plate_list.length;
	for(var i=0; i<cf_length; i++)
	{	
		lnum = c_comp_plate_list[i].map(function(x){return collection_list.map(function(y){return y.name;}).indexOf(x);});
		if(lnum[0]!=-1) lnum[3]=-1; // 舞舞なら極は表示しない
		if(lnum[1]!=-1) {lnum[2]=-1; lnum[3]=-1;} // 神なら将、極は表示しない
		complist.push(lnum.map(function(x){ return (x==-1)?"":("<img src='"+ collection_list[x].addr + "' width=105>")}).join(""));
	}
	return;
}
	
function analyzing_rating(dlist, crating, mrating)
{
	var tmp=0, str="", best30=0, history473=0;
	for(var i=0; i<30; i++)
	{
		best30 += dlist[i].music_rate;
	}	
	history473=best30;
	for(var i=30 ;i<mra_history;i++)
	{
		history473 += dlist[i].music_rate;
	}

	best_ave = (Math.floor(best30/30)/100).toFixed(2);
	top_rate = dlist[0].music_rate;
	best_limit = (Math.floor(dlist[29].music_rate)/100).toFixed(2);
	hist_limit = (Math.floor(dlist[mra_history-1].music_rate)/100).toFixed(2);
	if(Number(hist_limit)<=0)
	{
		var count=0;
		for(count=0; dlist[count].music_rate > 0; count++);
		hist_limit= (mra_history-count) + "曲不足";
	}
	
	best_rating = Math.floor(best30/44);	//best30はRating*100
	recent_rating = Math.floor(dlist[0].music_rate*10/44);
	hist_rating = Math.floor(history473/(mra_history*11));	// multiply 4/(473*44)
	
	your_recent= Number(crating)*100-hist_rating-best_rating;
	
	best_left = (44 - Math.ceil(best30%44))/100;
	hist_left = (mra_history*11 - Math.ceil(history473%(mra_history*11)))/100;

	expect_max = (Math.floor(best_rating + recent_rating + hist_rating)/100).toFixed(2);
	best_rating = (best_rating/100).toFixed(2);
	recent_rating = (recent_rating/100).toFixed(2);
	hist_rating = (hist_rating/100).toFixed(2);
	your_recent=(your_recent/100).toFixed(2);

	// tweet用文字列
	tweet_rate_str = your_id + rankname + "%20%3a" + your_rating +"%28" + your_max_rating + "%29" + "%0D%0A";
	tweet_rate_str += "B平均%3a" + best_ave + "%0D%0A";
	tweet_rate_str += "R平均%3a" + your_recent_ave + "%0D%0A";
	tweet_rate_str += "B下限%3a" + best_limit + "%0D%0A";
	tweet_rate_str += "H下限%3a" + hist_limit + "%0D%0A";
	tweet_rate_str += "予想到達Rating%3a" + expect_max + "%0D%0A";
	tweet_rate_str += "B%3a" + best_rating + "%20%2B%20R%3a" + recent_rating + "%20%2B%20H%3a" + hist_rating + "%0D%0A";
	tweet_rate_str += "旧式換算%3a" + old_rule_rating.toFixed(2) + "%0D%0A";
	
	return;
}

function analysis_playdata_sub_calc_ave(l)
{
	var sum=0;
	for(var i=0; i<Math.min(10, l.length); i++)
		sum+=l[i].rate_value;
	return sum;		
}

function analysis_playdata()
{
	play_hist50=play_hist.slice(0,50);
	play_hist50.sort(function(a,b){return b.rate_value-a.rate_value;});
	rcnt50=analysis_playdata_sub_calc_ave(play_hist50);
	your_recent_ave=(Math.floor(rcnt50/10)/100).toFixed(2);
	your_r_waku=(Math.floor(rcnt50/44)/100).toFixed(2);
	
	play_hist44=play_hist.slice(0,44);
	play_hist44.sort(function(a,b){return b.rate_value-a.rate_value;});
	rcnt44=analysis_playdata_sub_calc_ave(play_hist44);
	your_recent_ave44=(Math.floor(rcnt44/10)/100).toFixed(2);
	your_r_waku44=(Math.floor(rcnt44/44)/100).toFixed(2);
	
	
	play_hist30=play_hist.slice(0,30);
	play_hist30.sort(function(a,b){return b.rate_value-a.rate_value;});
	rcnt30=analysis_playdata_sub_calc_ave(play_hist30);
	your_recent_ave30=(Math.floor(rcnt30/10)/100).toFixed(2);
	your_r_waku30=(Math.floor(rcnt30/44)/100).toFixed(2);

	play_hist=null;
	
	return;
}

function frddata_copy()
{
	frd_best_ave=best_ave; frd_best_limit=best_limit; frd_hist_limit=hist_limit;
	frd_expect_max=expect_max
	frd_best_rating=best_rating; frd_best_left=best_left;
	frd_recent_rating=recent_rating; frd_top_rate=top_rate;
	frd_hist_rating=hist_rating; frd_hist_left=hist_left;
	frd_old_rule_rating=old_rule_rating; frd_recent=your_recent;
	return;
}
	

	
function get_ratingrank(rating)
{
	return (rating>=15)?("mai_rainbow"):(rating>=14.5)?("mai_gold"):(rating>=14)?("mai_silver"):(rating>=13)?("mai_copper"):
	(rating>=12)?("mai_violet"):(rating>=10)?("mai_red"):(rating>=7)?("mai_yellow"):(rating>=4)?("mai_green"):
	(rating>=1)?("mai_blue"):("mai_white");
}
	
function print_rank_comp(ver, background, fontcolor, rank1, rank2, comp1, comp2)
{
	var tmp = "";
	tmp += "<tr bgcolor=" + background + " align=center valign=middle>";
	tmp += "<th rowspan=2><font color='" + fontcolor + "'>" + ver + "</font></th>";
	tmp += "<th rowspan=2><font color='" + fontcolor + "'>";
	tmp += (rank2=="")?(rank1):(rank1=="")?(rank2):(rank1+"<br>"+rank2);
	tmp += "</font></th>";
	tmp += "<th><font color='" + fontcolor + "'>" + comp1 + "</th>";
	tmp += "</tr>";
	tmp += "<tr bgcolor=" + background + " align=center valign=middle>";
	tmp += "<th><font color='" + fontcolor + "'>" + comp2 + "</th>";
	tmp += "</tr>";
	
	return tmp;
}
	
function print_result_sub_print_header(title)
{
	var rslt_str ="";
	rslt_str += "<head>";
	rslt_str += "<title>" + title + " | 新・CYCLES FUNの寝言</title>";
    	rslt_str += "<link rel='stylesheet' media='all' type='text/css' href='https://sgimera.github.io/mai_RatingAnalyzer/css/mai_rating.css'>";
 	rslt_str += "<link rel='stylesheet' media='all' type='text/css' href='https://sgimera.github.io/mai_RatingAnalyzer/css/display.css'>";
 	rslt_str += "<link rel='stylesheet' media='all' type='text/css' href='https://sgimera.github.io/mai_RatingAnalyzer/css/result.css'>";
  	rslt_str += "</head>";
	
	return rslt_str;
}
	
function print_result_sub_print_title(str)
{
	var rslt_str="";
	rslt_str += "<h2 align=center>舞レート解析・あならいざもどき<br>";
	rslt_str += (hashtag.slice(-4)!="test")?(str):("(test)");
	rslt_str += "</h2>";
	
	rslt_str += "<hr><p align=center>" + music_count + "songs(" + music_update + ") version<br>";
	rslt_str += "Last Update : " + modoki_update + "<br>";
	rslt_str += "Programmed by <a href='https://twitter.com/sgimera'>@sgimera</a></p><hr>";

	return rslt_str;
}

function print_result_sub_print_data(data, idx, classname)
{
	var str="", tmplv;
	str += "<th class=" + classname + ">" + ((data.rate_values[idx]/100).toFixed(2)) + "</th>";
	tmplv=(data.lv[idx].slice(-1)=='-')?(data.lv[idx].slice(0, -1)):
		(data.lv[idx].slice(-1)=='=')?(data.lv[idx].slice(0, -1)):data.lv[idx];
	str += "<th class=" + classname + ">" + tmplv + "</th>";
	str += "<th class=" + classname + ">" + (100*data.achive[idx]).toFixed(4) + "%</th>";
	if(hashtag.slice(-4)=="test")
		str += "<td class=" + classname + ">" + (data.shortage[idx]) + "</td>";

	return str;
}
	
function print_result_sub_print_datalist(dlist, datedata, id, dan)
{
	var rslt_str ="", tmp_rate=0, rowspan_num=3;
	var exstr="", mastr="", restr="", ex_r=0, ma_r=0, re_r=0;
	var allspan=(hashtag.slice(-4)=="test")?6:5;

	rslt_str += "<table class=alltable border=1 align=center>";
	
	rslt_str += "<tr><th colspan=" + allspan + " bgcolor=#000000><font color=#ffffff>" + id + dan + "　全譜面データ<br>";
	rslt_str += datedata + "現在</font></th></tr>";

	for(var i=0; i<dlist.length; i++)
	{
		rowspan_num=0;
		restr=""; mastr=""; exstr="";
		re_r=dlist[i].rate_values[2]; ma_r=dlist[i].rate_values[1]; ex_r=dlist[i].rate_values[0];
		
		/* タイトル */
		if(dlist[i].lv[2] != "" && dlist[i].achive[2] != "---")
		{
			rowspan_num++;
			restr = print_result_sub_print_data(dlist[i], 2, "mai_remaster");
		}
	
		
			rowspan_num++;
			mastr = print_result_sub_print_data(dlist[i], 1, "mai_master")
		
		
			rowspan_num++;
			exstr = print_result_sub_print_data(dlist[i], 0, "mai_expert");
		

		rslt_str += "<tr><th colspan=" + allspan + " class=music_title>" + dlist[i].name + "</th></tr>"
		rslt_str += "<tr>";
		rslt_str += "<td align=center rowspan=" + rowspan_num + ">" + (i+1) + "</td>";
		rslt_str += "<th rowspan=" + rowspan_num + " ";
		rslt_str += "class=" + get_ratingrank(dlist[i].music_rate/100) + ">"
		rslt_str += (dlist[i].music_rate/100).toFixed(2)  + "</th>"
		if(restr!="")
		{
			rslt_str += restr;
			rslt_str += ((rowspan_num--) > 0)?("</tr><tr>"):"";
		}
		if(mastr!="")
		{
			rslt_str += mastr;
			rslt_str += ((rowspan_num--) > 0)?("</tr><tr>"):"";
		}
		if(exstr!="")
		{
			rslt_str += exstr
			rslt_str += ((rowspan_num--) > 0)?("</tr><tr>"):"";
		}
		rslt_str += "</tr>";
	}
	
	rslt_str += "</table>";
	
	return rslt_str;
}
function print_result_friend_sub(title, value, frd_value)
{
	var tmp = "";
	tmp += "<tr>";
	tmp += "<th align=center class=mai_white>" + value + "</th>"
	tmp += "<th>" + title + "</th>";
	tmp += "<th align=center class=mai_white>" + frd_value + "</th>"
	tmp += "</tr>";
	
	return tmp;
}

function print_result_rating_friend(title, value, dispbasevalue, frd_value, frd_dspbsvl)
{
	var tmp = "";
	tmp += "<tr>";
	tmp += "<th align=center class=" + get_ratingrank(dispbasevalue) + ">" + value + "</th>"
	tmp += "<th>" + title + "</th>";
	tmp += "<th align=center class=" + get_ratingrank(frd_dspbsvl) + ">" + frd_value + "</th>"
	tmp += "</tr>";
	
	return tmp;
}

function print_result_friend()
{
	var rslt_str="";
	rslt_str += "<html>";
	rslt_str += print_result_sub_print_header
		(your_id + rankname + "と" + frd_id + frd_rankname +"の舞レート比較結果");
	
	rslt_str += "<body>";
	rslt_str += "<p align=right><a href='" + mainet_dom + "friend/'>maimai.net HOMEに戻る</a></p>";
	rslt_str += "<h2 align=center>" + your_id + rankname + "<br>vs<br>" + frd_id + frd_rankname + "</h2>";
	
	var today = new Date();
	var data_str = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate() + " ";
	data_str += (("0"+today.getHours()).slice(-2)) + ":" + (("0"+today.getMinutes()).slice(-2)) + ":" + (("0"+today.getSeconds()).slice(-2));
	
	rslt_str += "<div id=player_rating_info>";
	rslt_str += "<table class=datatable border=1 align=center>";
	rslt_str += "<tr>";
	rslt_str += "<th colspan=3 bgcolor='#000000'><font color='#ffffff'>" + data_str + "現在</font></th>";
	rslt_str += "</tr>";

	rslt_str += "<tr valign=middle bgcolor=#000000>";
	rslt_str += "<th><font color='#ffffff'>" + your_id + "</font></th>";
	rslt_str += "<th><font color='#ffffff'> vs </font></th>";
	rslt_str += "<th><font color='#ffffff'>" + frd_id + "</font></th>";
	rslt_str += "</tr>";

	rslt_str += "<tr valign=middle bgcolor=#000000>";
	rslt_str += (rankicon !="")?("<th><img src='" + rankicon + "' height=50></th>"):"";
	rslt_str += "<th><font color=#ffffff>段位</font></th>";
	rslt_str += (frd_rankicon != "")?("<th><img src='" + frd_rankicon + "' height=50></th>"):"";
	rslt_str += "</tr>";

	rslt_str += print_result_rating_friend
		("現在のRating", your_rating + "<br>(" + your_max_rating + ")", your_rating,
			frd_rating + "<br>(" + frd_max_rating + ")", frd_rating);	
	rslt_str += print_result_rating_friend
		("BEST平均", best_ave, best_ave, frd_best_ave, frd_best_ave);
	rslt_str += print_result_rating_friend
		("RECENT平均", your_recent_ave, your_recent_ave, (Number(frd_recent)*4.4).toFixed(2), Number(frd_recent)*4.4);	
	rslt_str += print_result_rating_friend
		("BEST下限", best_limit, best_limit, frd_best_limit, frd_best_limit);
	rslt_str += print_result_friend_sub("HIST下限", hist_limit, frd_hist_limit);

	rslt_str += "<tr><th colspan=3 bgcolor='#000000'><font color='#ffffff'>予想到達可能Rating</font></th></tr>";

	rslt_str += print_result_rating_friend("予想値", expect_max, expect_max, frd_expect_max, frd_expect_max);
	rslt_str += print_result_rating_friend
		("BEST枠", best_rating + "<br>(" + (best_left.toFixed(2)) + ")", best_ave,
			frd_best_rating + "<br>(" + (frd_best_left.toFixed(2)) + ")", frd_best_ave);
	rslt_str += print_result_rating_friend
		("RECENT枠", recent_rating + "<br>(" + ((top_rate/100).toFixed(2)) + ")", top_rate/100,
			frd_recent_rating + "<br>(" + ((frd_top_rate/100).toFixed(2)) + ")", frd_top_rate/100);
	rslt_str += print_result_friend_sub
		("HISTORY枠", hist_rating + "<br>(" + (hist_left.toFixed(2)) + ")", 
		 frd_hist_rating + "<br>(" + (frd_hist_left.toFixed(2)) + ")");
	rslt_str += "</table>";

	if(hashtag.slice(-4)!="test")
	{
		rslt_str += "<h2 align=center>" + frd_id + "全譜面データ</h2>";
		rslt_str += print_result_sub_print_datalist(frd_datalist, data_str, frd_id, frd_rankname);
	}
	
	rslt_str += "</body>";
	rslt_str += "</html>";
	
	datalist=null;
	frd_datalist=null;
	document.open();
	document.write(rslt_str);
	rslt_str=null;
	document.close();
}

function print_result_sub(title, value, explain)
{
	var tmp = "";
	tmp += "<tr>";
	tmp += "<th>" + title + "</th>";
	tmp += "<th align=center class='tweet_info mai_white'>" + value + "</th>"
	tmp += "<td class=explain>" + explain + "</td>";
	tmp += "</tr>";
	
	return tmp;
}

function print_result_rating(title, value, explain, dispbasevalue)
{
	var tmp = "";
	tmp += "<tr>";
	tmp += "<th>" + title + "</th>";
	tmp += "<th align=center class='tweet_info " + get_ratingrank(dispbasevalue) + "'>" + value + "</td>"
	tmp += "<td class=explain>" + explain + "</td>";
	tmp += "</tr>";
	
	return tmp;
}

function print_result()
{
	var rslt_str="";

	rslt_str += "<html>";
	rslt_str += print_result_sub_print_header(your_id + rankname +"の舞レート解析結果");
	
	rslt_str += "<body>";
	
	var today = new Date();
	var data_str = today.getFullYear() + "/" + (today.getMonth()+1) + "/" + today.getDate() + " ";
	data_str += (("0"+today.getHours()).slice(-2)) + ":" + (("0"+today.getMinutes()).slice(-2)) + ":" + (("0"+today.getSeconds()).slice(-2));
	
	rslt_str += "<p align=right><a href='" + mainet_dom + "home'>maimai.net HOMEに戻る</a></p>";
	
	rslt_str += "<h2 align=center>" + your_id + rankname + "</h2>";
	if(hashtag.slice(-4)=="test")
	{
	rslt_str += "<center>";
	rslt_str += "<div class=game_display>";
	rslt_str += "<img src='" + your_frame + "' width=100%>";
	rslt_str += "<img src='" + your_icon + "' class=game_icon>";
	rslt_str += "<img src='" + your_plate + "' class=game_plate>";
	rslt_str += "<img src='" + rankicon + "' class=game_rank>";
	rslt_str += "<p class='game_rating " + get_ratingrank(your_rating) + "'>" + your_rating + "/" + your_max_rating + "</p>";
	rslt_str += "<p class=game_name>" + your_id + "</p>";
	rslt_str += "</center>";
	}		
	
	rslt_str += "<h2 align=center>Rating解析結果</h2>";

	rslt_str += "<table class=datatable border=1 align=center>";
	rslt_str += "<tr valign=middle>";
	rslt_str += "<th colspan=3 bgcolor='#000000'>";
	rslt_str += "<font color='#ffffff' class=tweet_info>" + your_id + "</font>";
	if(hashtag.slice(-4)!="test")
	{
	rslt_str += (rankicon!="")?("<img src='" + rankicon + "' height=50>"):"";
	}
	rslt_str += "</th>";
	rslt_str += "</tr>";

	rslt_str += "<tr><th colspan=3 bgcolor='#000000'><font color='#ffffff'>" + data_str + "現在</font></th></tr>";
	
	rslt_str += print_result_rating("現在の<br>Rating", your_rating + "<br>(" + your_max_rating + ")", "maimai.netで確認できるRating", 
					your_rating);
	rslt_str += print_result_rating("BEST平均", best_ave, "上位30曲の平均レート値", best_ave);
	rslt_str += print_result_rating("RECENT<br>50平均※", your_recent_ave +'<br>('+ your_r_waku + ')',
			"直近50譜面の上位10譜面平均<br>()内はR枠換算 参考値:" + your_recent, your_recent_ave);
	// rslt_str += print_result_rating("RECENT<br>44平均※", your_recent_ave44 +'<br>('+ your_r_waku44 + ')',
	//		"直近40譜面の上位10譜面平均<br>()内はR枠換算", your_recent_ave44);
	rslt_str += print_result_rating("RECENT<br>30平均※", your_recent_ave30 +'<br>('+ your_r_waku30 + ')',
			"直近30譜面の上位10譜面平均<br>()内はR枠換算", your_recent_ave30);
	rslt_str += print_result_rating("BEST下限", best_limit, "30位のレート値", best_limit);
	rslt_str += print_result_sub("HIST下限", hist_limit, mra_history + "位のレート値");

	rslt_str += "<tr><th colspan=3 bgcolor='#000000'><font color='#ffffff'>予想到達可能Rating</font></th></tr>";

	rslt_str += print_result_rating("予想値", expect_max, "下の3つの値の合計", expect_max);
	rslt_str +=
		print_result_rating("BEST枠", best_rating + "<br>(" + (best_left.toFixed(2)) + ")",
				    "(上位30曲の合計)/44<br>()は+0.01する為の必要レート", best_ave);
	rslt_str +=
		print_result_rating("RECENT<br>枠", recent_rating + "<br>(" + ((top_rate/100).toFixed(2)) + ")",
				    "レート値1位を10回達成<br>()は1位の単曲レート値", top_rate/100);
	rslt_str +=
		print_result_sub("HISTORY<br>枠", hist_rating + "<br>(" + (hist_left.toFixed(2)) + ")",
				 "(上位" + mra_history +"曲の合計)*(4/" + mra_history + ")/44<br>()は+0.01する為の必要レート");
	
	rslt_str += "</table>";
	rslt_str += "<p align=center>※RECENT平均は予測到達可能には影響しません。<br>あくまで現状の確認。</p>";

	rslt_str += "<p align=center>";
	rslt_str += "<a href='https://twitter.com/intent/tweet?hashtags=" + hashtag + "&text=" + tweet_rate_str + "' " + "target='_blank'>"
	rslt_str += "＞＞Rating情報のツイート＜＜</a></p>";

	rslt_str += "<p align=center>";
	rslt_str += "<a href='https://sgimera.github.io/mai_RatingAnalyzer/' target=_blank>";
	rslt_str += "＞＞解説は”新・CYCLES FUNの寝言”へ＜＜</a></p>";

	rslt_str += "<h2 align=center>Rank/Complete情報</h2>";

	rslt_str += "<table class=complist border=1 align=center>";
	
	rslt_str += "<tr bgcolor='#000000' align=center valign=middle>";
	rslt_str += "<th colspan=3><font color='#ffffff'>" + your_id + "のRank/Complete情報<br>" + data_str + "現在</font></th>";
	rslt_str += "</tr>";

	rslt_str += "<tr bgcolor='#FFFFFF' align=center valign=middle>";
	rslt_str += "<th>ver.</th>";	
	rslt_str += "<th>段位</th>";	
	rslt_str += "<th>制覇</th>";
	rslt_str += "</tr>";

	rslt_str += print_rank_comp
		('青<br>真', '#0095d9', '#FFFFFF', ranklist[0], ranklist[1], complist[0], complist[1]);
	rslt_str += print_rank_comp
		('緑<br>檄', '#00b300', '#FFFFFF', ranklist[2], ranklist[3], complist[2], complist[3]);
	rslt_str += print_rank_comp
		('橙<br>暁', '#fab300', '#000000', ranklist[4], ranklist[5], complist[4], complist[5]);
	rslt_str += print_rank_comp
		('桃<br>櫻', '#FF83CC', '#000000', ranklist[6], "", complist[6], complist[7]);
	rslt_str += print_rank_comp
		('紫<br>菫', '#b44c97', '#FFFFFF', ranklist[7], "", complist[8], complist[9]);

	rslt_str += "</table>";
	rslt_str += "</div>";
	
	ranklist=null;
	complist=null;

	if(hashtag.slice(-4)!="test")
	{
	rslt_str += "<h2 align=center>Recent情報</h2>";
	rslt_str += "<table align=center border=1 class=datatable>";
	rslt_str += "<tr><td colspan=5 align=center>50譜面版TOP10</td></tr>";
	for(var i=0; i<10; i++)
	{
		rslt_str += "<tr class=";
		rslt_str += (play_hist50[i].diff==2)?"mai_remaster":
				(play_hist50[i].diff==1)?"mai_master":
				(play_hist50[i].diff==0)?"mai_expert":"mai_white";
		rslt_str +="><th class=mai_white>" + (1+play_hist50[i].idx) + "</th><td>" + play_hist50[i].name + "</td><td>";
		rslt_str += (play_hist50[i].diff==2)?"Re:MASTER":
				(play_hist50[i].diff==1)?"MASTER":
				(play_hist50[i].diff==0)?"EXPERT":"ADV以下";
		rslt_str += "</td><td>" + (play_hist50[i].achi*100).toFixed(2) + "%</td><td>" + (play_hist50[i].rate_value/100).toFixed(2) + "</td></tr>";
	}
	rslt_str += "</table>";
	
	rslt_str += "<table align=center border=1 class=datatable>";
	rslt_str += "<tr><td colspan=5 align=center>30譜面版TOP10</td></tr>";
	for(var i=0; i<10; i++)
	{
		rslt_str += "<tr class=";
		rslt_str += (play_hist30[i].diff==2)?"mai_remaster":
				(play_hist30[i].diff==1)?"mai_master":
				(play_hist30[i].diff==0)?"mai_expert":"mai_white";
		rslt_str +="><th class=mai_white>" + (1+play_hist30[i].idx) + "</th><td>" + play_hist30[i].name + "</td><td>";
		rslt_str += (play_hist30[i].diff==2)?"Re:MASTER":
				(play_hist30[i].diff==1)?"MASTER":
				(play_hist30[i].diff==0)?"EXPERT":"ADV以下";
		rslt_str += "<td>" + (play_hist30[i].achi*100).toFixed(2) + "%</td><td>" + (play_hist30[i].rate_value/100).toFixed(2) + "</td></tr>";
	}
	rslt_str += "</table>";
	}
	
	
	rslt_str += "<h2 align=center>全譜面レート値データ</h2>";


//	else
//	{
//	rslt_str += "<p align=center>";
//	rslt_str += "<a href='https://twitter.com/intent/tweet?hashtags=";
//	rslt_str += hashtag;
//	rslt_str += "&text=";
//	rslt_str += tweet_best_str + "' ";
//	rslt_str += "target='_blank'>＞＞TOP10のツイートはここをクリック＜＜</a></p>";
//	}

	rslt_str += print_result_sub_print_datalist(datalist, data_str, your_id, rankname);	/* 全譜面データ出力 */

	rslt_str += "</body>";
	rslt_str += "</html>";
	
	datalist=null;
	document.open();
	document.write(rslt_str);
	rslt_str=null;
	document.close();
}

	
/*
function tweet_best(dlist)
{
	tweet_best_str = your_id + rankname + "%20:" + your_rating +"(" + your_max_rating + ")" + "%0D%0A";
	tweet_best_str += "B%3a" + best_rating + "%20%2B%20R%3a";
	tweet_best_str += recent_rating + " %2B%20H%3a"
	tweet_best_str += hist_rating + "%20%3d%20" + expect_max + "%0D%0A%0D%0A";
	
	for(var i=0; i<10; i++)
	{
		var tmp_rate = dlist[i].music_rate;
		tweet_best_str += (tmp_rate/100).toFixed(2) + ": "
		if(dlist[i].nick != "")
		{
			tweet_best_str += dlist[i].nick;
		}
		else if(dlist[i].name.length < 15)
		{
			tweet_best_str += dlist[i].name;
		}
		else
		{
			tweet_best_str += dlist[i].name.slice(0, 14) + "%ef%bd%9e";
		}
		(dlist[i].rate_values[1] == tmp_rate)?(tweet_best_str+=""):
		(dlist[i].rate_values[2] == tmp_rate)?(tweet_best_str+=" 白"):(tweet_best_str+= " 赤");
		tweet_best_str +="%0D%0A";
	}
}
*/

/* ココからメイン */
if(location.href == mainet_dom+"friend/friendProfile")
	friendmode = true;

var tmpstr = "--舞レート解析・あならいざもどき--\n";
tmpstr += (friendmode)?(" フレンドモード \n"):(""); 
tmpstr += (hashtag.slice(-4)!="test")?("(trial)\n\n"):("(test)\n\n");
tmpstr += maimai_inner_lv.length + "songs(" + mra_update_mlist + ") version\n";
tmpstr += "Last Update : ";
tmpstr += (mra_update_algorithm >= mra_update_llist)?mra_update_algorithm:mra_update_llist;
// tmpstr += "\n\n";
// tmpstr += "Programmed by Ludwig Josef Johann Wittgenstein";
if(!confirm(tmpstr))
	return;
	
if(friendmode)
{
	get_friend_name();	// 見ているフレンドページからデータ取得
}
	
get_your_id(mainet_dom + 'playerData/');	// プレイヤーデータの取得・共通処理
if(hashtag.slice(-4)=="test")
{
	if(limited_id.indexOf(your_id) < 0)
		hashtag=hashtag.slice(0,-4);
}
current_rank();	// 段位アイコンから段位名称に変更・共通処理
get_playdata(mainet_dom + 'playLog/');	// プレー履歴取得
	

if(!friendmode)	/* 通常時データ取得系処理 */
{
	get_music_mdata(ex_list, mainet_dom + 'music/expertGenre/');	// EXPERTデータ取得
	get_music_mdata(ma_list, mainet_dom + 'music/masterGenre/');	// MASTERのデータ取得
	get_music_mdata(re_list, mainet_dom + 'music/remasterGenre/');	// Re:MASTERのデータ取得
	get_trophy_data(clist, mainet_dom + 'collection/trophy/',
		   Array.prototype.concat.apply([],c_rank_trophy_list.concat(c_comp_trophy_list)));	// 称号データ取得
	get_nameplate_data(clist, mainet_dom + 'collection/namePlate/',
		   Array.prototype.concat.apply([],c_rank_plate_list.concat(c_comp_plate_list)));	// ネームプレートデータ取得
	get_current_frame(mainet_dom + 'collection/frame/');
	collection_filter(clist);
}
else /* フレンドモード用 */
{
	get_music_frd_mdata(ex_list, mainet_dom + 'friend/friendVs/expertGenre/');	// EXPERTデータ取得
	get_music_frd_mdata(ma_list, mainet_dom + 'friend/friendVs/masterGenre/');	// MASTERのデータ取得
	get_music_frd_mdata(re_list, mainet_dom + 'friend/friendVs/remasterGenre/');	// Re:MASTERのデータ取得
}
	
data2rating(datalist, 1);	// データ集計・自分
analysis_playdata();	// プレー履歴・recent算出

if(friendmode)
{
	data2rating(frd_datalist, 2);	// データ集計・フレンド
	analyzing_rating(frd_datalist, frd_rating, frd_max_rating);	// 全体データ算出・フレンド
	frddata_copy();	//フレンドのデータをフレンド変数にコピー
}
analyzing_rating(datalist, your_rating, your_max_rating);	// 全体データ算出・自分

maimai_inner_lv=null;	//データ消去
ex_list=null;
ma_list=null;
re_list=null;
clist=null;

if(friendmode)
{
	print_result_friend();
}
else 
{
	// 再計算。未検証扱いの譜面は最低値になる。全譜面データ表示用で、到達Ratingの計算への影響はない。
	
//	else
//		tweet_best(datalist);	//tweet用文言生成

	print_result();	//全譜面リスト表示
}

})(); void(0);
