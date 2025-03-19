"use strict";
function Logout() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [msg, setMsg] = React.useState('');
  
    React.useEffect(function() {
      setIsLoading(true);
  
      var url = 'webUser/logoff';
  
      ajax_alt(
        url,
        function(response) {
          setMsg(<strong>{response.errorMsg || 'Logout successful!'}</strong>);
          setIsLoading(false);
        },
        function(error) {
          setMsg(<strong>Logout failed: {error}</strong>);
          setIsLoading(false);
        }
      );
    }, []);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="logout">
        <h2>Logout</h2>
        <div>{msg}</div>
      </div>
    );
  }