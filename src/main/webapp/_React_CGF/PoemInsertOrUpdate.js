"use strict";

const PoemInsertOrUpdate = (props) => {
    var action = "insert";
    var id = "";
    var url = props.location.pathname;
    console.log("url that invoked PoemInsertOrUpdate is " + url);
    if (url.search(":") > -1) {
        const url_list = url.split(":");
        id = url_list[url_list.length - 1];
        console.log("to update id " + id);
        action = "update";
    } else {
        console.log("to insert");
    }

    const [poemData, setPoemData] = React.useState({
        poemId: "",
        poemName: "",
        poemAuthor: "",
        poemText: "",
        poemImg: "",
        poemGenre: "",
        poemDate: "",
        poemRating: "",
        webUserId: "",
        errorMsg: "",
    });

    const [userList, setUserList] = React.useState([]);

    const [errorObj, setErrorObj] = React.useState({
        poemId: "",
        poemName: "",
        poemAuthor: "",
        poemText: "",
        poemImg: "",
        poemGenre: "",
        poemDate: "",
        poemRating: "",
        webUserId: "",
        errorMsg: "",
    });

    const [submitCount, setSubmitCount] = React.useState(0);
    const [isLoading, setIsLoading] = React.useState(true);

    const encodePoemInput = () => {
        var poemInputObj = {
            poemId: poemData.poemId,
            poemName: poemData.poemName,
            poemAuthor: poemData.poemAuthor,
            poemText: poemData.poemText,
            poemImg: poemData.poemImg,
            poemGenre: poemData.poemGenre,
            poemDate: poemData.poemDate,
            poemRating: poemData.poemRating,
            webUserId: poemData.webUserId,
        };
        console.log("poemInputObj on next line");
        console.log(poemInputObj);
        return encodeURI(JSON.stringify(poemInputObj));
    };

    const setProp = (obj, propName, propValue) => {
        var o = Object.assign({}, obj);
        o[propName] = propValue;
        return o;
    };

    React.useEffect(() => {
        console.log("AJAX call for user list");
        ajax_alt("webUser/getAll", function (obj) {
            console.log("webUser/getAll Ajax success");
            if (obj.dbError.length > 0) {
                setErrorObj(setProp(errorObj, "webUserId", obj.dbError));
            } else {
                obj.webUserList.sort(function (a, b) {
                    if (a.userEmail > b.userEmail) {
                        return 1;
                    } else {
                        return -1;
                    }
                    return 0;
                });
                console.log("sorted user list on next line");
                console.log(obj.webUserList);
                setUserList(obj.webUserList);

                setPoemData(setProp(poemData, "webUserId", obj.webUserList[0].webUserId));
                console.log("set initial user id for poem to be " + obj.webUserList[0].webUserId);

                if (action === "update") {
                    console.log("Now getting poem record " + id + " for the update");
                    ajax_alt("poem/getById?poemId=" + id, function (obj) {
                        if (obj.errorMsg.length > 0) {
                            console.log("DB error trying to get the poem record for update");
                            setErrorObj(setProp(errorObj, "errorMsg", obj.errorMsg));
                        } else {
                            console.log("got the poem record for update (on next line)");
                            console.log(obj);
                            setPoemData(obj);
                        }
                    }, function (ajaxErrorMsg) {
                        setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
                    });
                }
            }
        }, function (ajaxErrorMsg) {
            setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
        });
        setIsLoading(false);
    }, []);

    React.useEffect(() => {
        console.log("Here is the poem data that will be sent to the insert/update API");
        console.log(poemData);

        console.log("SubmitCount has changed, value is " + submitCount);
        if (submitCount > 0) {
            ajax_alt("poem/" + action + "?jsonData=" + encodePoemInput(), function (obj) {
                console.log("These are the error messages (next line)");
                console.log(obj);

                if (obj.errorMsg.length === 0) {
                    obj.errorMsg = "Record Saved !";
                }

                setErrorObj(obj);
            }, function (ajaxErrorMsg) {
                setErrorObj(setProp(errorObj, "errorMsg", ajaxErrorMsg));
            });
        }
    }, [submitCount]);

    const validate = () => {
        console.log("Validate, should kick off AJAX call");
        setSubmitCount(submitCount + 1);
    };

    if (isLoading) {
        return <div> ... Loading ... </div>;
    }

    return (
        <table className="insertArea">
            <tbody>
                <tr>
                    <td>Id</td>
                    <td>
                        <input value={poemData.poemId} disabled />
                    </td>
                    <td className="error">{errorObj.poemId}</td>
                </tr>
                <tr>
                    <td>Poem Name</td>
                    <td>
                        <input
                            value={poemData.poemName}
                            onChange={(e) => setPoemData(setProp(poemData, "poemName", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemName}</td>
                </tr>
                <tr>
                    <td>Poem Author</td>
                    <td>
                        <input
                            value={poemData.poemAuthor}
                            onChange={(e) => setPoemData(setProp(poemData, "poemAuthor", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemAuthor}</td>
                </tr>
                <tr>
                    <td>Poem Text</td>
                    <td>
                        <textarea
                            value={poemData.poemText}
                            onChange={(e) => setPoemData(setProp(poemData, "poemText", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemText}</td>
                </tr>
                <tr>
                    <td>Poem Image</td>
                    <td>
                        <input
                            value={poemData.poemImg}
                            onChange={(e) => setPoemData(setProp(poemData, "poemImg", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemImg}</td>
                </tr>
                <tr>
                    <td>Poem Genre</td>
                    <td>
                        <input
                            value={poemData.poemGenre}
                            onChange={(e) => setPoemData(setProp(poemData, "poemGenre", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemGenre}</td>
                </tr>
                <tr>
                    <td>Poem Date</td>
                    <td>
                        <input
                            value={poemData.poemDate}
                            onChange={(e) => setPoemData(setProp(poemData, "poemDate", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemDate}</td>
                </tr>
                <tr>
                    <td>Poem Rating</td>
                    <td>
                        <input
                            value={poemData.poemRating}
                            onChange={(e) => setPoemData(setProp(poemData, "poemRating", e.target.value))}
                        />
                    </td>
                    <td className="error">{errorObj.poemRating}</td>
                </tr>
                <tr>
                    <td>Web User</td>
                    <td>
                        <select
                            onChange={(e) => setPoemData(setProp(poemData, "webUserId", e.target.value))}
                            value={poemData.webUserId}
                        >
                            {userList.map((user) => (
                                <option key={user.webUserId} value={user.webUserId}>
                                    {user.userEmail}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="error">{errorObj.webUserId}</td>
                </tr>
                <tr>
                    <td>
                        <br />
                        <button type="button" onClick={validate}>
                            Save
                        </button>
                    </td>
                    <td className="error" colSpan="2">
                        <br />
                        {errorObj.errorMsg}
                    </td>
                </tr>
            </tbody>
        </table>
    );
};