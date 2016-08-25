<?php

defined('BASEPATH') OR exit('No direct script access allowed');
class Majo extends CI_Controller{
	public $helpers = array('Form', 'html', 'Js', 'Time');
	/*
	This is the Controller of the initial page 
	Autor: Evinton Antonio Cordoba Mosquera
	Year: 2016, january
	 */
	public function __construct(){
		parent::__construct();
		$this->load->helper('url');
		$this->load->library("phpquery");
		$this->load->helper('file');
		$this->load->library('session');
		$this->load->helper('cookie');
		$this->load->model("Majo_model",'', TRUE);
		//$this->session->sess_destroy();
	}
	public function index(){
		
		$data["title"]="Primer App";
		$data["access_token"] =  array($this->session->userdata('access_token'),$this->session->userdata('access_token_secret'));
		$user = $this->input->cookie('majo_prefer');
		$network = $this->input->cookie('majo_network');
		if(isset($user) && isset($network))
		{
			//verify if the user exist and set the data for the user
			$user = $this->Majo_model->getUser($$user, $network);	
			
			if($user['is']){
				$data['name'] = $user['user_name'];
				$data['nick'] = $user['user_nickname'];
				$data['image'] = $user['user_image'];
				$data['is_user'] = $user['is'];
				$this->session->set_userdata('name', $user['user_name']);
				$this->session->set_userdata('nick', $user['user_nickname']);
				$this->session->set_userdata('image',$user['user_image']);
				$this->session->set_userdata('user',TRUE);
				
			}else{
				$data['is_user'] = FALSE;
			}
		}else{
			$data['is_user'] = FALSE;
		}
		
		$this->load->view("majo/create/create", $data);
	}

	public function _getMeme(){

	}

	public function getImage($str){
		$rimg = array();
		if(strlen($str)<3){
			array_push($rimg,array('err' => True));
		}
		else{
			if($this->input->is_ajax_request())
			{
				$str = (explode(" ",trim($str))>0)?str_replace(" ","+",$str):" ";
				$file_contents = file_get_contents("https://images.search.yahoo.com/search/images;_ylt=AwrBTvgXkOdV1pkAzL3z6Qt.;_ylu=X3oDMTE2OWtwcnU0BGNvbG8DYmYxBHBvcwMxBHZ0aWQDQUNCWUJSMV8xBHNlYwNwaXZz?p=".$str."&fr=sfp&fr2=piv-web");
				$pq = $this->phpquery->newDocumentHTML($file_contents,'utf-8');
				
				//parse  tag only for image
				$i=0;
				$scpast ="";
				foreach ($pq->find('img') as $img)
				{
					if(pq($img)->attr('src')!=null && $i>0){
				//	$type = get_mime_by_extension(pq($img)->attr('src'));
					/*$imgData = base64_encode(file_get_contents(pq($img)->attr('src')));
					$src = "data:image/jpeg;base64,".$imgData;*/
					
						if($scpast != pq($img)->attr('src')){
							array_push($rimg,array( "id" =>$i,
													"source" => pq($img)->attr('src'),
												   "alt" => $str)
										);
							$scpast = pq($img)->attr('src');
						}
					}
					$i++;
				  
				}
				 echo json_encode($rimg);
			}
		}
	}

	public function putImage($data){
		print_r($_POST);
	}
}