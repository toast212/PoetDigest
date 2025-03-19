"use strict";
const SearchUsers = () => {

    // Common React pattern. Display a "...Loading..." UI while the page
    // is loading. Don't try to render the component until this is false.
    const [isLoading, setIsLoading] = React.useState(true);

    const [dbList, setDbList] = React.useState([]);

    const [error, setError] = React.useState(null);

    const [filterStr, setFilterStr] = React.useState("");

    // useEffect takes two params. The first param is the function to be run.
    // The second param is a list of state variables that (if they change) will
    // cause the function (first param) to be run again.
    // RUN ONCE PATTERN: With [] as 2nd param, it runs the 1st param (fn) just once.
    React.useEffect(() => {

        // ajax_alt takes three parameters: the URL to read, Success Fn, Failure Fn.
        ajax_alt(
            "webUser/getAll", // URL for AJAX call to invoke

            // success function (anonymous)
            function (dbList) {   // success function gets obj from ajax_alt
                if (dbList.dbError.length > 0) {
                    console.log("Database error was " + dbList.dbError);
                    setError(dbList.dbError);
                } else {
                    console.log("Data was read from the DB. See next line,");
                    console.log(dbList.webUserList);
                    setDbList(dbList.webUserList);
                }
                setIsLoading(false); // allow the component to be rendered
            },

            // failure function (also anonymous)
            function (msg) {       // failure function gets error message from ajax_alt
                console.log("Ajax error encountered: " + msg);
                setError(msg);
                setIsLoading(false); // allow the component to be rendered
            }
        );
    }, []);

    function sortByProp(propName, sortType) {
        // sort the user list based on property name and type
        jsSort(dbList, propName, sortType);
        console.log("Sorted list is below");
        console.log(dbList);

        // For state variables that are objects or arrays, you have to do
        // something like this or else React does not think that the state
        // variable (dbList) has changed. Therefore, React will not re-render
        // the component.
        let listCopy = JSON.parse(JSON.stringify(dbList));
        setDbList(listCopy);
    }

    function callInsert() {
        window.location.hash = "#/register";
    }


    function filterList() {
        if (filterStr.length === 0) {
            return dbList;
        }
        return filterObjList(dbList, filterStr);
    }

    function deleteUser(userObj, indx) {

        console.log("To delete user " + userObj.userEmail + "?");

        if (confirm("Do you really want to delete " + userObj.userEmail + "? ")) {

            ajax_alt(
                "webUser/delete?userId=" + userObj.webUserId,

                function (obj) {
                    if (obj.errorMsg.length === 0) {
                        setDbList(deleteListEle(dbList, indx));
                        alert("User " + userObj.userEmail + " successfully deleted.");
                    } else {
                        alert("Web API successfully called, but got this error from the Web API: " + obj.errorMsg);
                    }
                },

                function (msg) {
                    alert("Ajax error: " + msg);
                }
            );

        }
    }

    function deleteListEle(theList, indx) {
        let newList = [];
        for (var i = 0; i < theList.length; i++) {
            if (i !== indx) {
                newList.push(theList[i]);
            }
        }
        console.log("here is list after deleting element " + indx);
        console.log(newList);
        return newList;
    }

    if (isLoading) {
        console.log("initial rendering, Data not ready yet...");
        return <div>Loading...</div>;
    }

    if (error) {
        console.log(`there must have been an ajax error (e.g., bad URL), 
        or database error (e.g., connection error because not tunnelled in)...`);
        return <div>Error: {error}</div>;
    }

    return (
        <div className="clickSort">
            <h3>
                User List&nbsp;
                <img src="icons/insert.png" alt="Insert" onClick={callInsert} />
            </h3>
            <label>
                <b>Filter:</b>
                <input
                    type="text"
                    value={filterStr}
                    onChange={(event) => setFilterStr(event.target.value)}
                />
            </label>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th onClick={() => sortByProp("userEmail", "text")}>
                            <img src="icons/sortUpDown16.png" alt="Sort" />
                            Email
                        </th>
                        <th className="textAlignCenter">Image</th>
                        <th
                            onClick={() => sortByProp("birthday", "date")}
                            className="textAlignCenter"
                        >
                            <img src="icons/blackSort.png" alt="Sort" />
                            Birthday
                        </th>
                        <th
                            onClick={() => sortByProp("membershipFee", "number")}
                            className="textAlignRight"
                        >
                            <img src="icons/whiteSort.png" alt="Sort" />
                            Membership Fee
                        </th>
                        <th onClick={() => sortByProp("userRoleType", "text")}>
                            <img src="icons/sortUpDown16.png" alt="Sort" />
                            Role
                        </th>
                        <th>Error</th>
                    </tr>
                </thead>
                <tbody>
                    {filterList().map((listObj, index) => (
                        <tr key={listObj.webUserId}>
                            <td>
                                <a href={'#/userUpdate/:' + listObj.webUserId}>
                                    <img src="icons/update.png" className="clickLink" />
                                </a>
                            </td>
                            <td className="textAlignCenter" onClick={() => deleteUser(listObj, index)}>
                                <img src="icons/delete.png" />
                            </td>
                            <td>{listObj.userEmail}</td>
                            <td className="shadowImage textAlignCenter">
                                <img src={listObj.userImage} alt="User" />
                            </td>
                            <td className="textAlignCenter">
                                {listObj.birthday}
                            </td>
                            <td className="textAlignRight">
                                {listObj.membershipFee}
                            </td>
                            <td className="nowrap">{listObj.userRoleType}</td>
                            <td>{listObj.errorMsg}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};