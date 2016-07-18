<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Create New Doctor</title>
</head>
<body>
    <h1>
            Create New Doctor
    </h1>
{{ Form::open(['url' => 'createSuccess']) }}

    {{ Form::label('username','Username:') }}
    {{ Form::text('username') }}   <br/>

    {{ Form::label('name','Name:') }}
    {{ Form::text('name') }}<br/>

    {{ Form::label('age','Age:') }}
    {{ Form::text('age') }}<br/>

    {{ Form::label('email','Email:') }}
    {{ Form::text('email') }}<br/>

    {{ Form::label('phone','Phone number:') }}
    {{ Form::text('phone') }}   <br/>

    {{ Form::label('phone','Password:') }}
    {{ Form::text('pass') }}   <br/>

    {!! Form::submit('Submit')!!}

{{ Form::close() }}
</body>
</html>