<?
class ImageDir {
	private static $VALID_EXTENSIONS = array('jpg','png','jpeg','bmp');
	
	// Is this a valid file name?
	private static function IsValidFile($fname) {
		if (empty($fname)) return false;
		if ($fname[0] == '.') return false;
		$ext = pathinfo($fname, PATHINFO_EXTENSION);
		if (!in_array($ext, self::$VALID_EXTENSIONS)) return false;
		return true;
	}
	
	// List all (valid) files in the given directory
	static public function ListAll($dir) {
		return array_filter(scandir($dir), array(__CLASS__, "IsValidFile"));
	}
}
?>