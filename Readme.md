<h1 align="center">Pembuatan Microservices aplikasi paymentku</h1>

<pre>Fitur yang tersedia :
- Topup uang lewat midtrans
- Transfer uang ke rekening lain
- Informasi pembayaran
- User Profile
- Authentication dan authorization
</pre>

<h3 align="center">Alur kerja aplikasi paymentku</h3>
1. User register, lalu login
<br/>
2. Berhasil login uangnya Rp.0
<br>
<h4>ALUR TOPUP</h4>
1. Topup uang melalui midtrans
<br/>
2. Jika berhasil tampilkan detail pembayaran seperti catatan, no hp, id akun, tanggal pembayaran, transferid
<br>
3. update uang sesuai dengan besar uang topup tadi

<h4>ALUR TRANSFER KE REKENING</h4>
1. memasukkan no hp tujuan
<br>
2. tampilkan detail akun si tujuan
<br>
3. masukkan besar uang yang akan di transfer
<br>
4. validasi uang jika jumlah uang < inputan uang tampilkan alert("uang anda tidak mencukupi")
<br>
5. tampilkan confirm("Apakah anda yakin akan mentransfer uang Rp.${uang} ke nomer ${nomer} ?")
<br>
6. Tampilkan detail transfer seperti user tujuan, tanggal transfer, besaran uang, sisa uang

<h4>ALUR USER PROFILE<h4>
1. Ketika user klik ikon profile
<br>
2. Tampilkan nama, nohp, email, umur

<h2 align="center">Technologi yang akan digunakan</h2>
<h6>BAHASA PEMROGRAMAN</h6>
1. Golang: Topup uang, transfer ke rekening, informasi pembayaran
<br>
2. Nestjs: Authentication
<br>
3. Expressjs: User profile

<h6>DATABASE</h6>
1. MYSQL: USER,PEMBAYARAN
<br>
2. REDIS: CACHING
