"use strict";
function Home() {
    return (
        <div className="home">
            <h1>Welcome to Poet Digest</h1>
            <p>
                <strong>Poet Digest</strong> is a place to digest your favorite poems, quotes, and artwork. Poems are shared and reviewed by users.
            </p>
            <p>
                Join today and enjoy our poems, quotes, artwork, and more!
            </p>
            <img src="pics/reading-1863.jpg" alt="A woman reading a book in a forest by Ivan Kramskoy" />
            <h2>Latest Poems</h2>
            <div id="poems">
                <img src="pics/poem1.jpg" alt="A poem about love" />
                <img src="pics/poem2.jpg" alt="A poem about nature" />
                <img src="pics/poem3.jpg" alt="A poem about death" />
                <img src="pics/poem4.jpg" alt="A poem about life" />
            </div>
        </div>
    );
}
