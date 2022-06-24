
var nameRegex = /^[A-Za-z.\s,/_-]*$/;
var nameyRegex = /^[A-Za-z0-9.\s,/_-]*$/;
var emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
// var usernameRegex = /^@[a-zA-Z]+\-[0-9]{2,}$/i;
var telRegex = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
// var passRegexy = /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,15}$/
const passRegex = /\d/;


//Is Any Input Empty
const isEmpty = (input) => {
    if (input == "" || input == null) {
        return true;
    } else {
        return false;
    }
};

//Is Name Input Valid
const validateName = (name) => {
    var bul = nameRegex.test(name);
    return bul;
};

const validateNamey = (name) => {
    var bul = nameyRegex.test(name);
    return bul;
};

//Is Email Input Valid
const validateEmail = (email) => {
    var bul = emailRegex.test(email);
    console.log(bul);
    return bul;
};

//Is Email Input Valid
const validateUsername = (username) => {
    // var bul = usernameRegex.test(username);
    // console.log(bul);
    return true;
};

//Is Telephone Input Valid
const validateTel = (tel) => {
    var bul = telRegex.test(tel);
    return bul;
};

//Is Password Input Valid
const validatePass = (password) => {
    if (passRegex.test(password) == false || password.length < 6) {
        return false
    }
    return true;
};

//Is dob Input Valid
const validateAge = (dob) => {
    var d = new Date();
    var date_divide = dob.split("-");
    var user_year = date_divide[0];
    var current_year = d.getFullYear();
    var new_age = parseInt(current_year) - parseInt(user_year);

    if (new_age > 18) {
        return false;
    } else {
        return true
    }
};

const isUrlValid = (userInput) => {
    var res = userInput.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null)
        return false;
    else
        return true;
}


//  Is FB link Input Valid
const validFBLink = (link) => {
    var pattern = /^(?:(?:http|https):\/\/)?(?:www.)?facebook.com\(?:(?:\w)*#!\)(?:profile.php\?id=(?=\d.*))?([\w-]*)?$/;
    if (pattern.test(link)) {
        return true
    }
    else {
        return false;
    }
}

//  Is IG link Input Valid
const validIGLink = (link) => {
    var pattern = /^(?:(?:http|https):\/\/)?(?:www.)?(instagram.com\/)?(?:@)?[a-z\d-_]{1,255}\s*$/i;
    if (link.match(pattern)) {
        console.log("yep");
        return true
    }
    else {
        return false;
    }
}

//  Is twitter link Input Valid
const validtwitterLink = (link) => {
    if (link.match(/^(?:(?:http|https):\/\/)?(?:www.)?(twitter.com\/)?(?:@)?[a-z\d-_]{1,255}\s*$/i) || link.match(/^@?(\w+)$/)) {
        return true;
    }
    else {
        return false;
    }
}


//Generate User Type
const generateUserType = (title) => {
    if (title == 'ADMS') {
        return "Super Admin";
    } else if (title == 'ADM') {
        return "Admin IT";
    } else if (title == 'ADME') {
        return "Admin Editor"
    } else if (title == 'GMR') {
        return 'Gamer';
    }

};

//Is Image
const isImage = (file) => {
    // console.log(file.mimetype)
    if ((file && file !== undefined) && (file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/webp")) {
        return true;
    } else {
        return false;
    }
};


const isTransImage = (file) => {
    return new Promise((resolve, reject) => {
        let hasAlpha = false;
        const canvas = document.querySelector('canvas');
        const gigy = document.getElementsByClassName('img-fluidy');
        canvas.classList.remove("d-none");
        if (gigy.length > 0) {
            gigy[0].classList.add("d-none");
        }
        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onerror = reject;
        img.onload = function () {
            // canvas.width = 100;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            for (let j = 0; j < imgData.length; j += 4) {
                if (imgData[j + 3] < 255) {
                    hasAlpha = true;
                    break;
                }
            }
            resolve(hasAlpha);
        };
        img.src = URL.createObjectURL(file);
    });
}

const validInteger = (integer) => {
    if (parseInt(integer) == NaN || parseInt(integer) <= 0) {
        return false;
    }
    else {
        return true
    }

}


const validFloat = (float) => {
    if (parseFloat(float) == NaN || parseFloat(float) < 0) {
        return false;
    }
    else {
        return true
    }

}





//Is Doc
const isDoc = (file) => {
    if (file.mimetype == "image/jpeg" || file.mimetype == "image/png" || file.mimetype == "application/pdf" || file.mimetype == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        return true;
    } else {
        return false;
    }
};

//function to split Array
const splitArray = (arr, n) => {
    var run = true;
    var supreme = [];
    var count = arr.length;
    var v = 0
    var f = n

    while (run) {
        var A = [];

        for (var t = v; t < f; t++) {
            A.push(arr[t]);

        }
        if (A.length > 0) {
            supreme.push(A);
        }

        count = count - n;
        v = v + n;

        if (count > n) {
            f = f + n;
        } else {
            f = arr.length;
        }

        if (count < 0) {
            run = false;
        }

    }
    return supreme;
};

// function to paginate Array
const paginateArray = (rar, n) => {
    if (rar.length > 12) {
        var thedy = this.splitArray(rar, 12);
        return [thedy[n], thedy.length];
    } else if (rar.length > 0 && rar.length < 12) {
        var supreme = [];
        supreme.push(rar);
        return [supreme, 1];
    } else {
        return [rar, -1]
    }
};

// function to validate date
const validFutureDate = (date) => {
    let d = new Date(date)
    let t = new Date();

    if (t > d) {
        return false;
    } else {
        return true;
    }
};

const validGreaterDate = (info, r) => {
    if (r === undefined || r == null || r == "") {
        return false;
    } else {
        let d = new Date(info);
        let t = new Date(r);

        if (d > t) {
            return true;
        } else {
            return false;
        }
    }
};

const validYTLink = (info) => {
    var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (info.match(p)) {
        return true;
    }
    return false;
}


// function to display error
const showError = (e_title, e_msg, e_class) => {
    var error = document.getElementById(e_class);
    var alert = document.getElementsByClassName('alert')[0];
    if (alert) {
        alert.classList.remove('show');
    }
    error.innerHTML = ``;
    error.innerHTML = ``;
    error.innerHTML = `  <div class="alert alert-` + e_title + ` alert-dismissible fade show" role="alert">
                                    <strong>` + e_title.toUpperCase() + `!</strong> ` + e_msg + `
                                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>`;

    // console.log(error);
    setTimeout(function () {
        var alert = document.getElementsByClassName('alert')[0];
        alert.classList.remove('show');
        error.innerHTML = ``;
    }, 50000);
};

const swalShowError = (e_msg, e_class) => {
    var error = document.getElementById(e_class);
    error.innerHTML = e_msg;
    error.style.display = "block";
};

const swalShowLoading = (title, msg, timer = 40000) => {
    Swal.fire({
        title: title,
        html: msg,
        timer: timer,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
    });
};




export {
    showError, isEmpty, validFutureDate, validateName, validateNamey, validateEmail, validateUsername, validateTel,
    validatePass, validateAge, isUrlValid, validFBLink, validIGLink, validtwitterLink, generateUserType, isImage,
    isDoc, splitArray, paginateArray, validGreaterDate, validYTLink, swalShowError, swalShowLoading, isTransImage,
    validInteger, validFloat,
}


