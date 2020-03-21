random.generator = Math.random.bind( Math );

function random( $1, $2, $3 ) {

    if ( arguments.length == 1 ) {
        
        if ( _.isArray( $1 ) ) {
            return $1[ ~~( random.generator() * ( $1.length - 1 ) ) ];
        }

        return random.generator() * $1;

    } else if ( arguments.length == 2 ) {

        return random.generator() * ( $2 - $1 ) + $1;

    }

    return random.generator();

};

random.range = function( $1, $2 ) {

    var min = -1, max = 1;

    switch ( arguments.length ) {
        case 1:
            min = -$1;
            max = $1;
            break;
        case 2:
            min = $1;
            max = $2;
            break;
    }

    return random.generator() * ( max - min ) + min;
    
};

random.int = function( $1, $2 ) {

    var min = -1, max = 1;

    switch ( arguments.length ) {
        case 1:
            min = -$1;
            max = $1;
            break;
        case 2:
            min = $1;
            max = $2;
            break;
    }

    return ~~( random.generator() * ( max - min ) + min );
    
};

random.angle = function() {
    return random.generator() * TWO_PI;  
};

random.chance = function( percent ) {
    return random.generator() < ( percent || 0.5 );
};

random.sign = function() {
    return random.generator() < 0.5 ? 1 : -1;
};