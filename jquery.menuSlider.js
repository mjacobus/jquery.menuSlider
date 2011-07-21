/*
 * jQuery Menu Slider
 *
 * @author Marcelo Jacobus <marcelo.jacobus@gmail.com>
 */
$.fn.menuSlider = function(options) {
    var s = {
        maxWidth: 100,
        getItems: function(ul){
            return ul.find('> li');
        },
        getItemWidth: function(li){
            return this.getTotalWidth(li);
        },
        getTotalWidth: function(e){
            return e.width() + parseInt(e.css('margin-left')) + parseInt(e.css('margin-right')) + parseInt(e.css('padding-left')) + parseInt(e.css('padding-right'));
        },
        getButtonsWidth:function(){
            var sum = 0;
            $('ul:first').parent().siblings('.action').each(function(){
                sum+=s.getTotalWidth($(this));
            });
            return sum;
        },
        prevButton: '&nbsp;&lt;&nbsp;',
        nextButton: '&nbsp;&gt;&nbsp;',
        postLoad:function(ul,limitDiv,blockDiv,container,prevButton,nextButton){
            
        }
    };
    if (options) {
        $.extend( s, options );
    }
    
    this.each(function(){
        var u = $(this),v = $(this).is(':visible'),w = 0,b,ms,nb,pb,l,t={
            f:null,
            l:null,
            p:null,
            n:null,
            t:[],
            getPrev:function(){
                return this.p;
            },
            setPrev:function(t){
                this.p=t;
            },
            setNext:function(t){
                this.n=t;
            },
            getNext:function(){
                return this.n;
            },
            prepare:function(hidePrev){
                nb.css('visibility','hidden');
                pb.css('visibility','hidden');
                var m=parseInt(u.css('margin-left'))*-1;
                var e=s.maxWidth+m,$this=this;
                //prev
                var i=[],ln=t.t.length;
                $.each(this.t,function(k,t){
                    i[ln-(k+1)] = t;
                });
                $.each(i,function(k,t){
                    if (t.s < m || t.s == 0){
                        $this.setPrev(t);
                        if(!hidePrev)pb.css('visibility','visible');
                        return false;
                    }
                });
                
                //next
                $.each(this.t,function(k,t){
                    if (t.e() > e){
                        $this.setNext(t);
                        nb.css('visibility','visible');
                        return false;
                    }
                });
            },
            showPrev: function(){
                var p=this.getPrev();
                u.css('margin-left',-p.s+p.index+'px');                
                this.prepare(this.getPrev().index===0);
            },
            showNext: function(){
                var right = this.getNext().e() + s.getButtonsWidth();
                var go=s.maxWidth-(right);
                u.css('margin-left',go+'px');               
                this.prepare();
            }
        };
        if (!v)return;
        var lw = -1;
        $.each(s.getItems(u),function(i,li){
            var _w = s.getItemWidth($(li))
            w += _w;
            t.t.push({
                index:i,
                w: _w,
                a: $(li).hasClass('active'),
                s: lw +1,
                e: function() {
                    return this.s + this.w;
                },
                spb: function(){
                    return this.e > w;
                },
                snb: function(){
                    return true;
                }
            });
            lw+=_w+1;
        });
        if (w <= s.maxWidth) {
            return;
        }
        u.css({
            width:w*2 + 'px',
            margin:0,
            padding:0,
            'float':'left'
        });
        b = u.wrap('<div class="block" />').parent();
        ms = b.wrap('<div class="menu-slider" style="overflow: hidden;" />').parent();
        ms.css({
            width:s.maxWidth+'px',
            height: u.css('height')
        });
        b.css({
            height: ms.css('height')
        });
        b.prepend('<a href="#" class="action slide-prev" style="float:left;visibility:hidden;">'+s.prevButton+'</a>');
        b.append('<a href="#" class="action slide-next" style="float:left">'+s.nextButton+'</a>');
        pb = b.children('.slide-prev');
        nb = b.children('.slide-next');
        l = u.wrap('<div class="limit" style="position:relative; float:left;overflow: hidden;margin:0;padding:0;" />').parent();
        l.css({
            width: [s.getTotalWidth(ms)-s.getTotalWidth(nb)-s.getTotalWidth(pb),'px'].join('')
        });
            
            
        pb.click(function(){
            t.showPrev();
            return false;
        });
        nb.click(function(){
            t.showNext();
            return false;
        });
        t.prepare(true);
        s.postLoad(u,l,b,ms,pb,nb);
        
    });
};