"use strict";
function Profile() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [user, setUser] = React.useState(null);
    const [msg, setMsg] = React.useState('');
  
    React.useEffect(function() {
      setIsLoading(true);
  
      var url = 'webUser/getProfile';
  
      ajax_alt(
        url,
        function(user) {
          if (user.errorMsg.length > 0) {
            setMsg(<strong>{user.errorMsg}</strong>);
          } else {
            setUser(user);
          }
          setIsLoading(false);
        },
        function(error) {
          setMsg(<strong>Failed to fetch profile: {error}</strong>);
          setIsLoading(false);
        }
      );
    }, []);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="profile">
        <h2>Profile</h2>
        {user ? (
          <div>
            <p>Welcome Web User: {user.webUserId}</p>
            <p>Email: {user.userEmail}</p>
            <p>Birthday: {user.birthday}</p>
            <p>Membership Fee: {user.membershipFee}</p>
            <p>User Role: {user.userRoleType}</p>
            <img src={user.userImage} alt="User" />
          </div>
        ) : (
          <div>{msg}</div>
        )}
      </div>
    );
  }