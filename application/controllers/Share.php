

<?php
/**
 * Simple controler for to share id distinct social network
 * Twitter, Facebook, Instagram, Reddit
 */
defined('BASEPATH') OR exit('No direct script access allowed');
/**
* 
*/
class Share extends CI_Controller
{
	private $connection;
	private $url = 'index.php/share/';
	private $callbackurl ="callback";
	private $urlimage;
	
	function __construct()
	{
		parent::__construct();
		//load the libraries for to share in
		//load the twwiter autentication
		$this->load->library('twitteroauth');
		$this->load->library('session');
		$this->load->helper('url');
		$this->load->model("Majo_model",'', TRUE);
		$this->load->library('browser');
		$this->callbackurl = $this->url.$this->callbackurl;
		$this->urlimage = base_url("assets/img/");
		
			
		/*print_r($this->session->all_userdata());
		$this->reset_session();
print_r($this->session->all_userdata());
		exit();*/
		//$data = $this->Majo_model->get_data($this->session->userdata("__ci_last_regenerate"));		
		
		if($this->session->userdata('user')){
			$data = $this->Majo_model->findNetwork($this->input->cookie('majo_prefer'),$this->input->cookie('majo_network'),1);
			$this->session->set_userdata('access_token', $data['access_token']);
			$this->session->set_userdata('access_token_secret', $data['access_token_secret']);
		}
		if(!is_null($this->session->userdata('access_token')) && !is_null($this->session->userdata('access_token_secret')))
		{
			// If user already logged in
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'), $this->session->userdata('access_token'),  $this->session->userdata('access_token_secret'));
		}
		elseif(!is_null($this->session->userdata('request_token')) && !is_null($this->session->userdata('request_token_secret')))
		{
			
			// If user in process of authentication
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'), $this->session->userdata('request_token'), $this->session->userdata('request_token_secret'));
			//print_r($this->connection);
		}
		else
		{
 			
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'));
		}
		
		
		//exit();
		/*
		/*if($data->access_token && $data->access_token_secret)
		{
			// If user already logged in
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'), $data->access_token, $data->access_token_secret);
			$this->session->set_userdata('access_token', $data->access_token);
			$this->session->set_userdata('access_token_secret', $data->access_token_secret);

		}
		elseif($data->request_token && $data->request_token_secret)
		{
			
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'), $data->request_token, $data->request_token_secret);
			// If user in process of authentication
			//$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'), $_COOKIE['request_token'], $_COOKIE['request_token_secret']);
		}
		else
		{
			
			// Unknown user
			
			$this->connection = $this->twitteroauth->create($this->config->item('twitter_consumer_token'), $this->config->item('twitter_consumer_secret'));
			
		}*/
	
		
	}
	public function verifyshare(){
		
		//IF HAVE visited the site and have autentucation 
		if(isset($_COOKIE['majo_prefer']) && isset($_COOKIE['majo_network'])){
			//search in database 
			//$data = $this->Majo_model->findNetwork($_COOKIE['majo_prefer'],$_COOKIE['majo_network'],1);
			$data = array('request' => FALSE);
		}else{
			$data = array('request' => TRUE);
		}
		echo json_encode($data);
	}
	public function index(){
		if($this->session->userdata('access_token') && $this->session->userdata('access_token_secret'))
		{
			
			// User is already authenticated. Add your user notification code here.
			//$content = $this->connection->get('followers/list');
			//print_r($content);
			
			//redirect(base_url('/'));
			//$this->postimage();
			//
			/*$data = array('access' => TRUE,
						  'cookie' => TRUE,
						  'redirectTo' => $this->url.""
						);	
			echo json_encode($data);*/
			$usershare = array(
						'share' => true,
						'username' => $this->session->userdata('name'),
						'nickname' => $this->session->userdata('nick'),
						'network' => array('id' => 1,
											'Name' => 'Twitter'
											)
			);

			echo json_encode($usershare);
		}
		else
		{
			// Making a request for request_token
			$request_token = $this->connection->getRequestToken(base_url($this->callbackurl));
			$this->session->set_userdata('request_token', $request_token['oauth_token']);
			$this->session->set_userdata('request_token_secret', $request_token['oauth_token_secret']);
			
			if($this->connection->http_code == "200")
			{
				$url = $this->connection->getAuthorizeURL($request_token);
				$data = array(
					"redirectTo" => $url,
					"error" => FALSE,
					"request" => TRUE
					);
				redirect($url);
				
				//echo json_encode($data);
			}
			else
			{
				$data = array(
					"redirectTo" => base_url('/'),
					"error" => TRUE,
					"request" => TRUE
					);
				echo json_encode($data);
				// An error occured. Make sure to put your error notification code here.
				//redirect(base_url('/'));
			}
		}
	}

	function callback(){
		echo "<br/>";
		
	
		if($this->input->get('oauth_token') && $this->input->get('oauth_verifier'))
		{
			//$content = $this->connection->get('account/verify_credentials');
			//var_dump($content);
			$access_token = $this->connection->getAccessToken($this->input->get('oauth_verifier'));
			
			if ($this->connection->http_code == 200)
			{
				$content = $this->connection->get('account/verify_credentials');

				$datasession = array(
						'sessio_id' => $this->session->userdata('__ci_last_regenerate'),
						'ip_address' => $this->input->ip_address(),
						'useragent' => 	$this->browser->showInfo('browser')."-".$this->browser->showInfo('version')."-".$this->browser->showInfo('os'),
						'access_token' => $access_token['oauth_token'],
						'access_token_secret' => $access_token['oauth_token_secret'],
						'request_token' => $this->session->userdata('request_token'), 
						'request_token_secret' => $this->session->userdata('request_token_secret'),
					);
				$user = array(
					'user_id' => $content->id_str,
					'screen_name' =>$content->screen_name,
					'name' =>$content->name,
					'user_image' => $content->profile_image_url,
					'user_location' => $content->location
					);
				$data = $this->Majo_model->insert_session($user,$datasession);
				if(!$data['error']){
					$time = 60*60*24*30*6;
					$this->input->set_cookie('majo_prefer',$data['majouser'],$time,'/');
					$this->input->set_cookie('majo_network',$data['cookieid'],$time,'/');
					$this->session->set_userdata('access_token', $access_token['oauth_token']);
					$this->session->set_userdata('access_token_secret', $access_token['oauth_token_secret']);
					$this->session->set_userdata('user_id', $access_token['user_id']);
					$this->session->set_userdata('name', $access_token['screen_name']);
					$this->session->set_userdata('nick',$content->name);
					$this->session->unset_userdata('request_token');
					$this->session->unset_userdata('request_token_secret');
					//$this->load->view('/majo/create/share',$usershare);
				}else{
					//eroor mostrar 
					$this->load->view('/majo/create/share',$usershare);
					echo json_encode($data);
					//send me message for email indicating the error
				}
				/*echo "<script type='text/javascript'>
					window.close();
					</script>";*/
				
				//redirect(base_url('/'));
			}
			else
			{
				//Error 
				//$this->load->view('/majo/create/share',$usershare);
				//print_r($access_token);
				// An error occured. Add your notification code here.
			//	redirect(base_url('/'));
			}
			
		}
		else
		{
			$this->reset_session();
			redirect(base_url($this->url));
		}

		/* 	$content = $connection->get('followers/list', array('screen_name' => 'Evinton'));
		 	echo json_encode($content);*/
	}
	public function postimage()
	{
		
			if($this->session->userdata('access_token') && $this->session->userdata('access_token_secret'))
			{
					$content = $this->connection->get('account/verify_credentials');
					
					if(isset($content->errors))
					{
						// Most probably, authentication problems. Begin authentication process again.
						$this->reset_session();
						redirect(base_url($this->url));
					}
					else
					{
						$image = str_replace('data:image/png;base64,', '', $this->input->post('dataimage'));
						$image = str_replace(' ', '+', $image);
						
						/*$img = "majo.png";
						$media = file_get_contents($img);
						$base = base64_encode($media);
						$base = $this->input->post('data');*/
						$dtimage = array(
							"media" => $image
							);						
						$result = $this->connection->post('https://upload.twitter.com/1.1/media/upload.json',$dtimage);
						$data = array(
							'status' => $this->input->post("texto"),
							'media_ids' => $result->media_id_string
						);
						$result = $this->connection->post('statuses/update', $data);
						if(!isset($result->errors))
						{
							
							//insert imgae
							$data = array(
								'user' => $result->user->id_str,
								'date' => date("Y-m-d H:i:s"),
								'url' => $result->entities->media[0]->media_url,
								'status_url' => $result->entities->media[0]->expanded_url,
								"network" => 1,
								'text' =>$result->text,
								'image_str' => $this->input->post('dataimage'),
								'long' => ' ',
								'lat' => ' ',
								'ip_address' => $this->input->ip_address()
								);
							$d= $this->Majo_model->insert_image($data);
							$save = array(
								'shared' => TRUE,
								'saved' => $d
								);
							echo json_encode($save);
							// Everything is OK
							//redirect(base_url('/'));
						}
						else
						{
							echo json_encode($result);
							// Error, message hasn't been published
							//redirect(base_url('/'));
						}
					}
				}
			else
			{
					// User is not authenticated.
					//redirect(base_url($this->url));
				 echo json_encode(array('errors' => TRUE));
			}
			
		}
	public function sess(){
		print_r($this->session->all_userdata());
	}
	/**
	 * Reset session data
	 * @access	private
	 * @return	void
	 */
	private function reset_session()
	{
		$this->session->unset_userdata('access_token');
		$this->session->unset_userdata('access_token_secret');
		$this->session->unset_userdata('request_token');
		$this->session->unset_userdata('request_token_secret');
		$this->session->unset_userdata('user_id');
		$this->session->unset_userdata('screen_name');
		$this->session->unset_userdata('name');
	}
	private function reset_cookie()
	{
		$this->input->set_cookie('access_token',null);
		$this->input->set_cookie('access_token_secret',null);
		$this->input->set_cookie('request_token',null);
		$this->input->set_cookie('request_token_secret',null);
		$this->input->set_cookie('user_id',null);
		$this->input->set_cookie('screen_name',null);
	}
}