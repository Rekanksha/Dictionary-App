const wrapper = document.querySelector(".wrapper");
const searchInput = wrapper.querySelector("input");
const InfoText = wrapper.querySelector(".info-text");
const synonyms = wrapper.querySelector(".synonyms .list");
const antonyms = wrapper.querySelector(".antonyms .list");
const volumeIcon = wrapper.querySelector(".word i");
const removeIcon = wrapper.querySelector(".search span");
let audio;

function data(result, word) {
    if (result.title) {
        InfoText.innerHTML = `Can't find the meaning of <span>"${word}"</span>. <br> Please, search a valid word`;
    } else {
        console.log(result);

        wrapper.classList.add("active");
        let definitions = result[0].meanings[0].definitions[0];
        let phonetics = `${result[0].meanings[0].partOfSpeech} ${result[0].phonetics[0].text}`;
        let other = result[0].meanings[0];

        //passing a particular response data to particular html element
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".word span").innerText = phonetics;
        document.querySelector(".meaning span").innerText = definitions.definition;
        audio = new Audio(result[0].phonetics[0].audio);

        if (other.synonyms[0] == undefined) {
            synonyms.parentElement.style.display = "none";
        } else {
            synonyms.parentElement.style.display = "block";
            synonyms.innerHTML = " ";
            for (let i = 0; i < 5; i++) {
                let tag = `<span onclick="search('${other.synonyms[i]}')">${other.synonyms[i]},</span>`;
                if (other.synonyms[i] == undefined) {
                    break;
                }
                synonyms.insertAdjacentHTML("beforeend", tag);
            }
        }

        if (other.antonyms[0] == undefined) {
            antonyms.parentElement.style.display = "none";
        } else {
            antonyms.parentElement.style.display = "block";
            antonyms.innerHTML = "  ";
            for (let i = 0; i < 5; i++) {
                let tag = `<span>${other.antonyms[i]}</span> `;
                if (other.antonyms[i] == undefined) {
                    break;
                }
                antonyms.insertAdjacentHTML("beforeend", tag);
            }
        }
    }
}

function search(word) {
    searchInput.value = word;
    fetchApi(word);
}

function fetchApi(word) {
    wrapper.classList.remove("active");
    InfoText.style.color = "#000";
    InfoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => data(result, word));
}

searchInput.addEventListener("keyup", e => {
    if (e.key === "Enter" && e.target.value) {
        fetchApi(e.target.value);
    }
});

volumeIcon.addEventListener("click", () => {
    audio.play();
});

removeIcon.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    wrapper.classList.remove("active");
    InfoText.style.color = "#9a9a9a";
    InfoText.innerHTML = "Type any existing word and press enter to get meaning, example, synonyms, etc.";
});
