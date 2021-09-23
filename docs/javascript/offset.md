# event事件中的偏移量

::: tip 提示
  下文中evt为event事件对象的简写
:::

## evt.screentX/evt.screentY
  事件发生时鼠标相对于电脑屏幕的坐标。e.screenX,e.screenY的最大值不会超过屏幕分辨率。（例如分辨率为：1920 x 1080）

## evt.clientX/evt.clientY
  事件发生时鼠标在浏览器内容区域的坐标。
浏览器内容区域就是浏览器窗口中用来显示网页的可视区域，不包括滚动条和工具栏，也不随滚动条的移动而移动。
当浏览器窗口缩小时，evt.clientX/evt.clientY的最大值也会缩小。

## evt.pageX/evt.pageY
  事件发生时鼠标相对于整个页面的坐标。整个页面是说整个网页的区域

## evt.offsetX/evt.offsetY
  事件发生时鼠标相对于事件绑定元素的坐标

  例如：

  ``` js
    const box = document.querySelector('.box')
    box.addEventListener('mousedown', (evt) => {})
    // box就是事件绑定元素
  ```
## 图示
  ![各个偏移量图示](/img/offset.png)

## 拖拽示例
``` html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title></title>
		<style type="text/css">
			html, body {
				margin: 0;
				padding: 0;
			}
			.box {
				position: absolute;
				width: 100px;
				height: 100px;
				top: 0;
				left: 0;
				border: 1px solid red;
				background: pink;
			}
		</style>
	</head>
	<body>
		<div class="box"></div>
		<script type="text/javascript">
			const box = document.querySelector('.box')
			box.onmousedown = function (e) {
				document.onmousemove = function (evt) {
					box.style.left = evt.clientX - e.offsetX + "px";
					box.style.top = evt.clientY - e.offsetY + "px";
				}
				document.onmouseup = function () {
					document.onmousemove = null
					document.onmouseup = null
				}
			}
		</script>
	</body>
</html>
```
  