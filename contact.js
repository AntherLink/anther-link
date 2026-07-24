
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
		const message = form.message;

		// reset
		[name,email,message].forEach(i=>showError(i,''));

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

		// simulate submit
		submitBtn.disabled = true;
		submitBtn.textContent = 'Sending...';

		setTimeout(()=>{
			submitBtn.disabled = false;
			submitBtn.textContent = 'Send Message';
			form.reset();
			success.hidden = false;
			// hide after a few seconds
			setTimeout(()=> success.hidden = true, 5000);
		}, 900);
	});
});

