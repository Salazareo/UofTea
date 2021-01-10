// Cost factor of generating salt, let's keep it at 10 and see how it goes for now...
export const saltRounds = 10;
export const courseReviewReplace = 4;
export const profReviewReplace = 1;
export const emailFrom = 'UofTea <no-reply@uoftea.ca>';
export const resetEmail = `You are receiving this because you (or someone else) have requested the reset of the password for your account.


Please click on the following link, or paste this into your browser to complete the process:


https://{{host}}/reset/{{url}}


If you did not request this, please ignore this email and your password will remain unchanged.`

export const resetHTML = `<div style='text-align:center;'>
<h1>UofTea Password reset</h1>
<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
<br/>
<p>Please click on the following link, or paste this into your browser to complete the process:</p>
<a href='https://{{host}}/reset/{{url}}'>https://{{host}}/reset/{{url}}</a>
<br/>
<p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
</div>`

export const verifyEmail = `UofTea New Account Verification

You're receiving this email because you signed up to UofTea.ca.

Not verifying your account means it will be deleted within 2 weeks...
Please click on the following link, or paste this into your browser to complete the verification:

https://{{host}}/verify/{{jsonB64}}

If you did not make an account please ignore this email, the unverified account will be deleted.
`

export const verifyHTML = `<div style='text-align:center;'>
<h1>UofTea New Account Verification</h1>
<p>You're receiving this email because you signed up to UofTea.ca.</p>
<br/>
<p>Not verifying your account means it will be deleted within 2 weeks...</p>
<p>Please click on the following link, or paste this into your browser to complete the verification:</p>
<a href='https://{{host}}/verify/{{jsonB64}}'>https://{{host}}/verify/{{jsonB64}}</a>
<br/>
<p>If you did not make an account please ignore this email, the unverified account will be deleted.</p>
</div>`