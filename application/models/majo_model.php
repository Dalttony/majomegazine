<?php
defined('BASEPATH') OR exit('No direct script access allowed');
class Majo_model extends CI_Model {

	private $id = "";
	private $request_token="";
	private $request_token_secret="";
	private $date;
	 function __construct()
    {
        // Call the Model constructor
        parent::__construct();
    }

    function get_data($id){
    	$query = $this->db->get_where('session', array('id' => $id));
    	 return $query->row();
    }
    function insert_session($user,$data){
    	$time = 60*60*24*30*6;
        $us = array(
            'user_id' => $user['user_id'],
            'user_name' => $user['name'],
            'user_nickname' => $user['screen_name'],
            'user_image' => $user['user_image'],
            'location' => $user['user_location'],
            'data_create' => date("Y-m-d H:i:s"),
            'autenticatedId'=> sha1(md5($user['user_id'])).":".sha1(md5($data['request_token_secret'])),
            'autenticatedUser' =>sha1(md5($user['user_id'])),
            'expired' => date('Y-m-d H:i:s', time() + $time)
            );
         $session = array(
            'session_id' => $data['sessio_id'],
            'date' => date("Y-m-d H:i:s"),
            'user_id' => $us['user_id'],
            'ip_address' =>  $data["ip_address"],
            'browser' => $data["useragent"]
        );
       
    	$this->db->trans_start();
        


        $this->db->insert('user', $us);
         $this->access($us['user_id'],1,$data);
    	$insert = $this->db->insert('session', $session);

        $this->db->trans_complete();
        if ($this->db->trans_status() === FALSE)
        {
            $this->db->trans_rollback();
            return array(
                'error' => TRUE,
                "cookie" => log_message()
                );
        }
        else
        {
            $this->db->trans_commit();
           return array(
                'error' => FALSE,
                'cookieid' => md5($data['request_token_secret']),
                'majouser' => md5($us['user_id'])
                );
        }
    }

    function update_session($id,$enddate){
    	$data = array(
	        'enddate' => date("Y-m-d H:i:s")
	    );
    	$this->db->where('id', $id);
    	echo $this->db->update('session', $data);
    }
    function findNetwork($prefer,$network,$netid){
        $result = $this->db->get_where("user",array('autenticatedUser' => sha1($prefer)));
         if($result->num_rows() > 0 ){
            $row = $result->row_array();
            $network = $this->db->get_where('usertoken',array('user_id' => $row['user_id'],'socialnetwork_id'=>$netid));
            if($network->num_rows() > 0){
                $network = $network->row_array();
                $data = array('request' => FALSE);
                $data['access_token'] = $network['access_token'];
                $data['access_token_secret'] = $network['access_token_secret'];
                
            }else{                
                $data = array('request' => TRUE);
            }
            
         }else{
            $data = array('request' => TRUE);
         }
         return $data;
    }
    /**
     * getuser, return the  user object in the database
     */
    public function getUser($prefer, $network){
         $result = $this->db->get_where("user", array('autenticatedUser' => sha1($prefer)));
         if($result->num_rows()>0){
             $row = $result->row_array();
             $row['is'] = TRUE;
         }else
         {
            $row = array('is' => FALSE);
         }
         return $row;
    }
    function access($userid,$scid,$data){
         $acc = array(
            'access_token' => $data['access_token'],
            'access_token_secret' => $data['access_token_secret'],
            'request_token' => $data['request_token'],
            'request_token_secret' => $data['request_token_secret'],
            'user_id' => $userid,
            'socialnetwork_id' => $scid,
            'user_id_str' => $userid,
            'data_create' => date("Y-m-d H:i:s"),
            'ip_address' => $data['ip_address'],
            'browser' => $data['useragent']
            );
         $insert = $this->db->insert('usertoken', $acc);
    }

    public function insert_image($data){
        $image = array(
            'user_id' => $data['user'],
            'date' => $data['date'],
            'url' => $data['url'],
            'network_id' => $data['network'],
            'text_state' => $data['text'],
            'image_str' => $data['image_str'],
            'longi' => $data['long'],
            'lat' => $data['lat'],
            'ip_address'=> $data['ip_address']
            );
      //$this->db->insert_string('imageshared', $image)
        //$this->db->affected_rows()
      
      $erro = FALSE;
         if($this->db->insert('imageshared', $image)){
            $erro = TRUE;
        }else{
            //insert in error table
          
        }
        return $erro;
    }
}