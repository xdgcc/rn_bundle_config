import React, {Component, PropTypes} from 'react';
import {
    Dimensions,
    PixelRatio,
    Platform,
    StatusBar,
    SafeAreaView,
    View
} from 'react-native';
let props = {};
export default class Resolution {
    static get(useFixWidth = true){
        return useFixWidth?{...props.fw}:{...props.fh}
    }

    static setDesignSize(dwidth=750,dheight=1336,dim="window"){
        let designSize = {width:dwidth,height:dheight};
        let navHeight = Platform.OS === 'android' ? StatusBar.currentHeight : 64;
        let pxRatio = PixelRatio.get(dim);
        let {width,height} = Dimensions.get(dim);
        if(dim != "screen")height-=navHeight;
        let w = PixelRatio.getPixelSizeForLayoutSize(width);
        let h = PixelRatio.getPixelSizeForLayoutSize(height);
        let fw_design_scale = designSize.width/w;
        let fw_width = designSize.width;
        let fw_height = h*fw_design_scale;
        let fw_scale = 1/pxRatio/fw_design_scale;
        props.fw = {width:fw_width,height:fw_height,scale:fw_scale,navHeight};
    }
    static FixWidthView = (p) => {
        let {width,height,scale,navHeight} = props.fw;
        return (
            <View {...p} style={{
                marginTop:0,
                width:width,
                height:height,
                backgroundColor: 'transparent',
                transform:[{translateX:-width*.5},
                            {translateY:-height*.5},
                            {scale:scale},
                            {translateX:width*.5},
                            {translateY:height*.5}]
            }}>
            </View>
        );
    };
};
//init
Resolution.setDesignSize();

