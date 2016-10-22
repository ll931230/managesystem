<?php

// header("Content-type: text/html; charset=utf-8");

// file_get_contents 获取php请求数据，
// json_decode 将请求的是数据转化成数组
$res = json_decode(file_get_contents('php://input', 'r'), true);

// 启动session服务
session_start();

// 将请求发送的数据保存在session中
$_SESSION['username'] = $res['username'];
$_SESSION['password'] = $res['password'];

// 封装一个返回数据
$opt = array('errno' => 0, 'data' => array('username' => $res['username']));

// 将数组转化成json
echo json_encode($opt);

//登录成功
// $_SESSION['username'] = $_POST['username'];
// $_SESSION['userid'] = $_POST['password'];
