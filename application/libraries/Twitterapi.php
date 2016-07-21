<?php 
if ( ! defined('BASEPATH')) exit('No direct script access allowed'); 

Class Twitterapi{
	private $response= array(); // header response of navegador
	private $host = "https://api.twitter.com/1.1/";
	private $cunsomer_key="bhcnsN33BGzZBSRySfMy9T5zb"; 
	private $cunsomer_secret_key="3Jgq00O9V9XZ3M1Tl0lTEmf5RaQKROIRwXC5wNdD4SLK3yBRFN";
	private static $owner="dalttony"
	private static $owner_id = "227388336";
	private static $oauth_token="227388336-KRmb945bSTXnUm3lURlGLWCg41KZhEwWPoPhOY1P";
	private static $oauth_secret="g50cpGwEOqPEN5vtYhFSFS4w44zYCWXbhIlbYc2iP8FQ9"
	private $method = array("GET","POST");
	private $get_method["GET"] = array();
	private $post_method["POST"] = array();

	static function getInstance(){
		
	}


	
}