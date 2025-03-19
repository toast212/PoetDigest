"use strict";
function Login() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [user, setUser] = React.useState(null);
    const [msg, setMsg] = React.useState('');

    function handleSubmit() {
        setIsLoading(true);

        var url = 'webUser/logon?email=' + encodeURIComponent(email) + '&password=' + encodeURIComponent(password);

        ajax_alt(
            url,
            function (user) {
                if (user.errorMsg.length > 0) {
                    setMsg(<strong>{user.errorMsg}</strong>);
                    setUser(null);
                } else {
                    setMsg(<strong>Login successful!</strong>);
                    setUser(user);
                }
                setIsLoading(false);
            },
            function (error) {
                setMsg(<strong>Login failed: {error}</strong>);
                setUser(null);
                setIsLoading(false);
            }
        );
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="login">
            <h2>Login</h2>
            {user ? (
                <div>
                    <h3>Welcome, {user.userEmail}!</h3>
                    <p>User ID: {user.webUserId}</p>
                    <p>User Email: {user.userEmail}</p>
                    <p>User Role ID: {user.userRoleId}</p>
                    <p>User Role Type: {user.userRoleType}</p>
                    <p>Membership Fee: {user.membershipFee}</p>
                    <p>Birthday: {user.birthday}</p>
                    <img src={user.userImage} alt="User" />
                </div>
            ) : (
                <div className="form">
                    <div>
                        <label>Email:</label>
                        <input type="email" value={email} onChange={function (e) { setEmail(e.target.value); }} />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" value={password} onChange={function (e) { setPassword(e.target.value); }} />
                    </div>
                    <button onClick={handleSubmit}>Login</button>
                </div>
            )}
            <div>{msg}</div>
        </div>
    );
}