// LocalStorageService.js
export const LocalStorageService = (function () {
    var _service;
  
    function _getService() {
      if (!_service) {
        _service = this;
        return _service;
      }
      return _service;
    }
  
    function _setToken(tokenData) {
      if (tokenData) {
        localStorage.setItem("accessToken", tokenData.access_token);
      }
    }
  
    function _getAccessToken() {
      return localStorage.getItem("accessToken");
    }
  
    function _getRefreshToken() {
      return localStorage.getItem("refreshToken");
    }
  
    function _clearToken() {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("googleAccessToken");
      localStorage.removeItem("refreshToken");
    }
  
    function _setTokenGoogle(tokenData) {
      if (tokenData) {
        localStorage.setItem("googleAccessToken", tokenData.access_token);
      }
    }
  
    function _getAccessTokenGoogle() {
      return localStorage.getItem("googleAccessToken");
    }
  
    return {
      getService: _getService,
      setToken: _setToken,
      getAccessToken: _getAccessToken,
      setTokenGoogle: _setTokenGoogle,
      getAccessTokenGoogle: _getAccessTokenGoogle,
      getRefreshToken: _getRefreshToken,
      clearToken: _clearToken,
    };
  })();
  