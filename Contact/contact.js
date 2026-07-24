
document.addEventListener('DOMContentLoaded', function(){
	const form = document.getElementById('contactForm');
	const success = document.getElementById('successMessage');
	const submitBtn = document.getElementById('submitBtn');

	function validateEmail(email){
		return /^\S+@\S+\.\S+$/.test(email);
	}

	function showError(input, msg){
		const container = input.closest('.field');
		const err = container.querySelector('.error');
		err.textContent = msg || '';
		input.setAttribute('aria-invalid', !!msg);
	}

	form.addEventListener('submit', function(e){
		e.preventDefault();
		let valid = true;
		const name = form.name;
		const email = form.email;
		const subject = form.subject;
		const message = form.message;

		// reset
		[name,email,subject,message].forEach(i=>showError(i,''));

		if(!name.value.trim()){
			showError(name,'Please enter your name');
			valid = false;
		}
		if(!email.value.trim() || !validateEmail(email.value.trim())){
			showError(email,'Please enter a valid email');
			valid = false;
		}
		if(!message.value.trim()){
			showError(message,'Please enter a message');
			valid = false;
		}

		if(!valid) return;

		const formData = {
			name: name.value.trim(),
			email: email.value.trim(),
			subject: subject.value.trim(),
			message: message.value.trim()
		};

		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending...';

		fetch('/submit', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(formData)
		})
		.then(response => {
			if (!response.ok) throw new Error('Unable to save form data.');
			return response.json();
		})
		.then(() => {
			form.reset();
			success.hidden = false;
			setTimeout(() => success.hidden = true, 5000);
		})
		.catch(error => {
			console.error(error);
			alert('Unable to save form data. Make sure the server is running.');
		})
		.finally(() => {
			submitBtn.disabled = false;
			submitBtn.textContent = 'Send Message';
		});
	});
});

