
javascript:
(
	if(!confirm('1。')){
	return;}
	function(j,f)
	{
		j=['https://noname258.github.io/2516/data.js',
		   'https://noname258.github.io/2516/calc.js',
		   'https://noname258.github.io/2516/body.js'];
		f=function(s,u)
		{
			if(!confirm('2。')){
	return;}
			if(j.length==0)
			{
				return;
			}
			u=j.shift()+'?'+Date.now();
			s=document.createElement('script');
			document.body.appendChild(s);
			s.charset='UTF-8';
			s.addEventListener('load',f);
			s.src=u;
		};
		(document.readyState=='loading')?document.addEventListener('DOMContentLoaded',f):f();
	}
)();
