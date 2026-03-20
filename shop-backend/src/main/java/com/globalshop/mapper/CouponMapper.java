package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.Coupon;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface CouponMapper extends BaseMapper<Coupon> {
    @Select("SELECT * FROM coupons WHERE code = #{code} AND enabled = 1 AND (expires_at IS NULL OR expires_at > NOW())")
    Coupon findValidByCode(String code);
}
