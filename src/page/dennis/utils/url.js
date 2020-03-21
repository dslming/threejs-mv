( function( href ) {

    var h = href.indexOf( '#' );
    var q = href.indexOf( '?' );
    var search = h == -1 ? href.substring( q ) : href.substring( q, h );

    var url = window.url = {

        hash: h == -1 ? undefined : href.substring( h+1 ),

        boolean: function( name, defaultValue ) {
            if ( !url.hasOwnProperty( name ) )
                return defaultValue;
            return url[ name ] !== 'false';
        },
        
        number: function( name, defaultValue ) {
            var r = parseFloat( url[ name ] );
            if ( r != r ) 
                return defaultValue;
            return r;
        },
        
        prop: function( prop, value ) {
            var str = prop + '=' + value;
            if ( q == -1 ) return '?' + str;
            var prev = prop + '=' + url[ prop ];
            var str;
            if ( search.indexOf( prev ) == -1 ) {
                str = search + '&' + str;
            } else { 
                str = search.replace( prev, str );
            }
            str = str.replace( /\&+$/, '' ).replace( /&+/g, '&' );
            return str;
        },

        removeProp: function( prop ) {
            var str = search.replace( new RegExp( prop + '(=([^&]+))?', 'gm' ), '' );
            str = str.replace( /\&+$/, '' ).replace( /&+/g, '&' );
            return str;
        } 

    };

    search.replace(
        /([^?=&]+)(=([^&]+))?/g,
        function( $0, $1, $2, $3 ) {
          url[ $1 ] = decodeURIComponent( $3 );
        }
    );

})( location.href );