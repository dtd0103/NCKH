const tableContainer = document.querySelector(".content");

fetch("http://localhost:8081/")
    .then((res) => {
        if (!res.ok) throw new Error("Cannot response");
        return res.json();
    })
    .then((data) => {
        console.log(data);
        data.forEach((element) => {
            tableContainer.insertAdjacentHTML(
                "beforeend",
                `<tr>
                    <td>${element.DM_Ma}</td>
                    <td>${element.DM_Ten}</td>
                    <td>${element.DM_HinhAnh}</td>
                </tr>`
            );
        });
    })
    .catch((err) => {
        console.error(err);
    });
