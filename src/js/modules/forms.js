const forms = () => {
    const form = document.querySelectorAll('form'),
          inputs = document.querySelectorAll('input'),
          phoneInputs = document.querySelectorAll('input[name="user_phone"]');

    phoneInputs.forEach(item => {
        item.addEventListener('input', () => {
            item.value = item.value.replace(/\D/, '');
        });
    });

    const message = {
        loading: "Идет загрузка...",
        success: "Спасибо! Специалист скоро с вами свяжется",
        failure: "Ошибка, что-то пошло не так..."
    };

    const postData = async (url, data) => {
        document.querySelector('.status').textContent = message.loading;
        let res = await fetch(url, {
            method: "POST",
            body: data
        });

        return await res.text();
    };    

    const clearInputs = () => {
        inputs.forEach(item => {
           item.value = '';             
        });
    };

    form.forEach(item => {
        item.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('div');//блок, в который будем помещать сообщение из объекта
            statusMessage.classList.add('status');//добавляем стиль блоку
            item.appendChild(statusMessage);//помещаем блок на страницу

            const formData = new FormData(item);//собираем все данный, находящиеся в каждой форме

            postData('assets/server.php', formData)
                .then(res => {
                    console.log(res);
                    statusMessage.textContent = message.success;
                })
                .catch(() => statusMessage.textContent = message.failure)
                .finally(() => {
                    clearInputs();
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 5000);
                });
        });
    });
};

export default forms;